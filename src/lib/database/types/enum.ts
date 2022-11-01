export enum QueryType {
    Delete = "DELETE",
    Insert = "INSERT INTO",
    Select = "SELECT",
    Update = "UPDATE"
}

export enum DataType {
    FLOAT = "FLOAT",
    INT = "INT",
    JSON = "JSON",
    VARCHAR = "VARCHAR"
}

export enum Operators {
    EQ = "=",
    GT = ">",
    GTE = ">=",
    IN = "IN",
    LT = "<",
    LTE = "<=",
    NEQ = "!=",
    NIN = "NOT IN",
    NNULL = "IS NOT NULL",
    NULL = "IS NULL",
    SEQ = "<=>"
}

export enum DatabaseDriver {
    LOCAL = 'local',
    MYSQL = 'mysql',
    SQLITE = 'sqlite'
}