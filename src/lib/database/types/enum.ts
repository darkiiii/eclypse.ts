export enum QueryType {
    Select = "SELECT",
    Insert = "INSERT INTO",
    Update = "UPDATE",
    Delete = "DELETE"
}

export enum DataType {
    INT = "INT",
    FLOAT = "FLOAT",
    VARCHAR = "VARCHAR",
    JSON = "JSON"
}

export enum Operators {
    EQ = "=",
    SEQ = "<=>",
    NEQ = "!=",
    GT = ">",
    GTE = ">=",
    LT = "<",
    LTE = "<=",
    IN = "IN",
    NIN = "NOT IN",
    NULL = "IS NULL",
    NNULL = "IS NOT NULL"
}

export enum DatabaseDriver {
    LOCAL = 'local',
    SQLITE = 'sqlite',
    MYSQL = 'mysql'
}