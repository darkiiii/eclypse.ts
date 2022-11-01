import type {IDatabase, IDatabaseSQLiteConfig} from "../types/database";
import {QueryType} from "../types/enum";
import type {QueryOptions} from "../types/query";

export class Database implements IDatabase {
    readonly version = "sqlite-";

    constructor(config: IDatabaseSQLiteConfig) {

    }

    public async query(opts: QueryOptions): Promise<any> {
        return new Promise(async (resolve, reject) => {
            throw new Error("Method not implemented");
            switch (opts.type) {
                case QueryType.Select:

                case QueryType.Insert:

                case QueryType.Update:

                case QueryType.Delete:

            }

            resolve("bite");
        });
    };
}