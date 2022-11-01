import type { ClientOptions} from "discord.js";
import {Client} from "discord.js";
import type {IBot} from "./interfaces/bot";
import type {ILogger} from "./interfaces/logger";

export class Bot extends Client implements IBot {
    public readonly logger: ILogger;

    public constructor(logger: ILogger, options: ClientOptions) {
        super(options);
        this.logger = logger;
    }
}