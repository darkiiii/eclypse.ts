import * as fs from "node:fs";
import type {IDatabase, IDatabaseLocalConfig} from "../types/database";
import {Operators, QueryType} from "../types/enum";
import type {QueryOptions} from "../types/query";

export class Database implements IDatabase {
    public readonly version = "fs-internal";

    private readonly path: string;

    public constructor(config: IDatabaseLocalConfig) {
        this.path = config.path ? config.path : './db/';
        if (!this.path.endsWith("/")) this.path += "/";
        fs.access(this.path, fs.constants.F_OK, (err) => {
            if (err) fs.mkdir(this.path, () => {})
        });
    }

    public async query(opts: QueryOptions): Promise<any> {
        return new Promise((resolve, reject) => {
            const file = this.path + opts.table + ".json";
            fs.access(file, fs.constants.F_OK, async (err) => {
                if (err) fs.writeFile(file, "{\"table\": []}", () => {});

                fs.readFile(file, (err, data) => {
                    if (err) return reject(err);
                    const json = JSON.parse(data.toString()).table;
                    const res: any[number][string] = [];

                    switch (opts.type) {
                        case QueryType.Select:
                            let num = 0;
                            for (const row of json) {
                                const passed = this.condition(opts, row);
                                if (passed) {
                                    const res_row: any[string] = {};
                                    if (opts.fields) {
                                        for (const field of opts.fields) {
                                            res_row[field] = row[field];
                                        }
                                    } else {
                                        for (const field in row) {
                                            res_row[field] = row[field];
                                        }
                                    }
                                    res.push(res_row);
                                    num++;
                                    if (opts.limit && num >= opts.limit) break;
                                }
                            }
                            break;
                        case QueryType.Insert:
                            for (const row of json) if (opts.values[0].value === row[opts.values[0].key]) { reject("Row already exists."); return; }
                            const res_row: any[string] = {};
                            for (const val of opts.values) res_row[val.key] = val.value;
                            json.push(res_row);
                            res.push(res_row);
                            fs.writeFileSync(file, JSON.stringify({table: json}));
                            break;
                        case QueryType.Update:
                            for (const key in json) {
                                const passed = this.condition(opts, json[key]);
                                if (passed) {
                                    for (const val of opts.modifier) json[key][val.key] = val.value;
                                    res.push(json[key]);
                                }
                            }

                            fs.writeFileSync(file, JSON.stringify({table: json}));
                            break;
                        case QueryType.Delete:
                            for (const key in json) {
                                const passed = this.condition(opts, json[key]);
                                if (passed) res.push(json.splice(key, 1));
                            }

                            fs.writeFileSync(file, JSON.stringify({table: json}));
                            break;
                    }

                    resolve(res);
                })
            });
        });
    };

    private condition(opts: QueryOptions, row: any[string]) {
        let passed = true;
        if ("condition" in opts && opts.condition) for (const cond of opts.condition) {
            switch (cond.operator) {
                case Operators.EQ:
                case Operators.SEQ:
                    if (cond.value !== row[cond.key]) passed = false;
                    break;
                case Operators.NEQ:
                    if (cond.value === row[cond.key]) passed = false;
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
                    for (const val of cond.value) if (val === row[cond.key]) break;
                    passed = false;
                    break;
                case Operators.NIN:
                    for (const val of cond.value) if (val === row[cond.key]) passed = false;
                    break;
                case Operators.NULL:
                    if (row[cond.key] !== null) passed = false;
                    break;
                case Operators.NNULL:
                    if (row[cond.key] === null) passed = false;
                    break;
            }
        }

        return passed;
    }
}