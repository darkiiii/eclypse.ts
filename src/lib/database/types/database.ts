import * as mysql from "mariadb";
import {QueryOptions} from "./query";
import {DatabaseDriver} from "./enum";

export interface IDatabase {
    query: (opts: QueryOptions) => Promise<any>;
}

export interface IDatabaseCommonConfig {
    driver: DatabaseDriver;
}

export interface IDatabaseLocalConfig extends IDatabaseCommonConfig {
    driver: DatabaseDriver.LOCAL;
    path?: string;
}

export interface IDatabaseSQLiteConfig extends IDatabaseCommonConfig {
    driver: DatabaseDriver.SQLITE;
}

export interface IDatabaseMySQLConfig extends IDatabaseCommonConfig, mysql.PoolConfig {
    driver: DatabaseDriver.MYSQL;
}

export type IDatabaseConfig = IDatabaseLocalConfig | IDatabaseSQLiteConfig | IDatabaseMySQLConfig;