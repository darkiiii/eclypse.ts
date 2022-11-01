import {ILogger} from "./interfaces/logger";
import {IBot} from "./interfaces/bot";
import {Client, ClientOptions} from "discord.js";

export class Bot extends Client implements IBot {
    readonly logger: ILogger;

    public constructor(logger: ILogger, options: ClientOptions) {
        super(options);
        this.logger = logger;
    }
}