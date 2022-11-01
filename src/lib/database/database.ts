import {IDatabase, IDatabaseConfig} from "./types/database";
import {DatabaseDriver} from "./types/enum";

export default async function registerDatabase(config: IDatabaseConfig = {driver: DatabaseDriver.LOCAL}): Promise<IDatabase> {
    return new Promise((resolve, reject) => {
        switch (config.driver) {
            case DatabaseDriver.LOCAL:
                import("./drivers/local").then(db => {
                    resolve(new db.Database(config));
                })
                break;
            case DatabaseDriver.SQLITE:
                import("./drivers/sqlite").then(db => {
                    resolve(new db.Database(config));
                })
                break;
            case DatabaseDriver.MYSQL:
                import("./drivers/mysql").then(db => {
                    resolve(new db.Database(config));
                })
                break;
            default:
                reject("Database config is invalid.");
                break;
        }
    });
}