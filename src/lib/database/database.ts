import type {IDatabase, IDatabaseConfig} from "./types/database";
import {DatabaseDriver} from "./types/enum";

export default async function registerDatabase(config?: IDatabaseConfig): Promise<IDatabase> {
    return new Promise((resolve, reject) => {
        void selectDriver(config ?? { driver: DatabaseDriver.LOCAL }, resolve, reject);
    });
}

async function selectDriver(config: IDatabaseConfig, resolve: (value: IDatabase) => void, reject: (reason: any) => void): Promise<void> {
    let db;
    switch (config.driver) {
        case DatabaseDriver.LOCAL:
            db = await import("./drivers/local");
            resolve(new db.Database(config));
            break;
        case DatabaseDriver.SQLITE:
            db = await import("./drivers/sqlite");
            resolve(new db.Database(config));
            break;
        case DatabaseDriver.MYSQL:
            db = await import("./drivers/mysql");
            resolve(new db.Database(config));
            break;
        default:
            reject(new Error("Database config is invalid."));
            break;
    }
}