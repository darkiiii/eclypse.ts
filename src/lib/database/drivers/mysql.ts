import * as mysql from "mariadb";

import {DatabaseDriver, Operators, QueryType} from "../typings/enum";
import {QueryOptions} from "../typings/query";
import {IDatabase, IDatabaseMySQLConfig} from "../typings/database";

export class Database implements IDatabase {
    readonly version = "mariadb-" + mysql.version;

    private _pool: mysql.Pool;

    constructor(config: IDatabaseMySQLConfig) {
        this._pool = mysql.createPool(config);
    }

    public async query(opts: QueryOptions): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const query: any[] = [opts.type];
            switch (opts.type) {
                case QueryType.Select:
                    if (opts.fields) query.push(opts.fields.map((val: string) => {
                        return `"${val}"`;
                    }).join(", "));
                    else query.push("*");
                    query.push(`FROM \`${opts.table}\``);
                    if (opts.limit) query.push(`LIMIT ${opts.limit}`);
                    break;
                case QueryType.Insert:
                    query.push(`\`${opts.table}\``);
                    query.push("(" + opts.values.map((val: any) => {
                        return `"${val.key}"`;
                    }).join(", ") + ")");
                    query.push("VALUES");
                    query.push("(" + opts.values.map((val: any) => {
                        return (typeof val.value === "string") ? `"${val.value}"` : val.value;
                    }).join(", ") + ")");
                    break;
                case QueryType.Update:
                    query.push(`\`${opts.table}\` SET`);
                    query.push(opts.modifier.map((val: any) => {
                        return `"${val.key}" = ${typeof val.value === "string"? `"${val.value}"` : val.value}`;
                    }).join(", "));
                    break;
                case QueryType.Delete:
                    query.push(`FROM \`${opts.table}\``);
                    break;
            }
            if ("condition" in opts && opts.condition) {
                query.push("WHERE");
                query.push(opts.condition.map((val, key) => {
                    let str = "\"" + key + "\" " + val.operator + " ";
                    switch (typeof val.value) {
                        case "string":
                            str += (val.operator === Operators.OTHER) ? val.value : ("\"" + val.value + "\"");
                            break;
                        default:
                            str += val.value;
                            break;
                    }
                    return str;
                }).join(" AND "));
            }

            let conn; let res: any;
            try {
                conn = await this._pool.getConnection();
                res = JSON.parse(await conn.query(this.json_resolve(query.join(" ") + ";")));
            } catch (err) {
                reject(err);
            } finally {
                if (conn) conn.end();
                return resolve(res);
            }
        });
    };

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