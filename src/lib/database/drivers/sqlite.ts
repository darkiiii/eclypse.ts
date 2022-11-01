import {QueryType} from "../types/enum";
import {QueryOptions} from "../types/query";
import {IDatabase, IDatabaseSQLiteConfig} from "../types/database";

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