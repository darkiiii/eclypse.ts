import * as mysql from "mariadb";
import type {IDatabase, IDatabaseMySQLConfig} from "../types/database";
import {Operators, QueryType} from "../types/enum";
import type {QueryOptions} from "../types/query";

export class Database implements IDatabase {
    public readonly version = "mariadb-" + mysql.version;

    private readonly _pool: mysql.Pool;

    public constructor(config: IDatabaseMySQLConfig) {
        this._pool = mysql.createPool(config);
    }

    public async query(opts: QueryOptions): Promise<any> {
        return new Promise((resolve, reject) => {
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
                    let str = "\"" + key.toString() + "\" " + val.operator + " ";
                    switch (typeof val.value) {
                        case "string":
                            if (val.operator === Operators.IN || val.value === "") {
                                str += val.value
                            } else {
                                str += "\"" + val.value + "\""
                            }

                            break;
                        default:
                            str += val.value;
                            break;
                    }

                    return str;
                }).join(" AND "));
            }

            void this.run(query.join(" ") + ";", resolve, reject);
        });
    };

    private async run(query: string, resolve: (value: IDatabase) => void, reject: (reason: any) => void): Promise<void> {
        let conn;
        let res: any;
        try {
            conn = await this._pool.getConnection();
            res = JSON.parse(await conn.query(query));
        } catch (error) {
            reject(error);
        } finally {
            if (conn) await conn.end();
            resolve(res);
        }
    }
}