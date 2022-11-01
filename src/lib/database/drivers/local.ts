import * as fs from "node:fs";

import {Operators, QueryType} from "../types/enum";
import {QueryOptions} from "../types/query";
import {IDatabase, IDatabaseLocalConfig} from "../types/database";

export class Database implements IDatabase {
    readonly version = "fs-internal";

    private readonly path: string;

    constructor(config: IDatabaseLocalConfig) {
        this.path = config.path ? config.path : './db/';
        if (!this.path.endsWith("/")) this.path += "/";
        if (!fs.existsSync(this.path)) fs.mkdir(this.path, () => {});
    }

    public async query(opts: QueryOptions): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const file = this.path + opts.table + ".json";
            if (!fs.existsSync(file)) fs.writeFileSync(file, "{\"table\": []}");
            const json = JSON.parse(fs.readFileSync(file).toString()).table;
            const res: any[number][string] = [];
            switch (opts.type) {
                case QueryType.Select:
                    let num: number = 0;
                    for (const row of json) {
                        const passed = this.condition(opts, row);
                        if (passed) {
                            const res_row: any[string] = {};
                            if (opts.fields) for (const field of opts.fields) {
                                res_row[field] = row[field];
                            } else for (const field in row) {
                                res_row[field] = row[field];
                            }
                            res.push(res_row);
                            num++;
                            if (opts.limit && num >= opts.limit) break;
                        }
                    }
                    break;
                case QueryType.Insert:
                    for (const row of json) if (opts.values[0].value === row[opts.values[0].key]) return reject("Row already exists.");
                    const res_row: any[string] = {};
                    for (const val of opts.values) res_row[val.key] = val.value;
                    json.push(res_row);
                    res.push(res_row);
                    fs.writeFileSync(file, this.json_resolve(JSON.stringify({table: json})));
                    break;
                case QueryType.Update:
                    for (const key in json) {
                        const passed = this.condition(opts, json[key]);
                        if (passed) {
                            for (const val of opts.modifier) json[key][val.key] = val.value;
                            res.push(json[key]);
                        }
                    }
                    fs.writeFileSync(file, this.json_resolve(JSON.stringify({table: json})));
                    break;
                case QueryType.Delete:
                    for (const key in json) {
                        const passed = this.condition(opts, json[key]);
                        if (passed) res.push(json.splice(key, 1));
                    }
                    fs.writeFileSync(file, this.json_resolve(JSON.stringify({table: json})));
                    break;
            }
            resolve(res);
        });
    };

    private condition(opts: QueryOptions, row: any[string]) {
        let passed = true;
        if ("condition" in opts && opts.condition) for (const cond of opts.condition) {
            switch (cond.operator) {
                case Operators.EQ:
                case Operators.SEQ:
                    if (cond.value != row[cond.key]) passed = false;
                    break;
                case Operators.NEQ:
                    if (cond.value == row[cond.key]) passed = false;
                    break;
                case Operators.GT:
                    if (cond.value > row[cond.key]) passed = false;
                    break;
                case Operators.GTE:
                    if (cond.value >= row[cond.key]) passed = false;
                    break;
                case Operators.LT:
                    if (cond.value < row[cond.key]) passed = false;
                    break;
                case Operators.LTE:
                    if (cond.value <= row[cond.key]) passed = false;
                    break;
                case Operators.IN:
                    for (const val of cond.value) if (val == row[cond.key]) break;
                    passed = false;
                    break;
                case Operators.NIN:
                    for (const val of cond.value) if (val == row[cond.key]) passed = false;
                    break;
                case Operators.NULL:
                    if (null != row[cond.key]) passed = false;
                    break;
                case Operators.NNULL:
                    if (null == row[cond.key]) passed = false;
                    break;
            }
        }
        return passed;
    }

    private json_resolve(str: string) {
        str = str.replace(/\\n/g, "\\n")
            .replace(/\\'/g, "\\'")
            .replace(/\\"/g, '\\"')
            .replace(/\\&/g, "\\&")
            .replace(/\\r/g, "\\r")
            .replace(/\\t/g, "\\t")
            .replace(/\\b/g, "\\b")
            .replace(/\\f/g, "\\f");
        // remove non-printable and other non-valid JSON chars
        str = str.replace(/[\u0000-\u001F]+/g, "");
        return str;
    };
}