import type {ILogger} from "./logger";

export interface IBot {
    readonly logger: ILogger;
}