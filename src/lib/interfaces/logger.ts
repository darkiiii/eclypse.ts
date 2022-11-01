// Same as in @darki_/logger
export interface ILoggerMethod {
    (msg: string, ...args: any[]): void
    (obj: object, msg?: string, ...args: any[]): void
}

export interface ILogger {
    debug: ILoggerMethod
    error: ILoggerMethod,
    info: ILoggerMethod,
    log: ILoggerMethod,
    warn: ILoggerMethod
}