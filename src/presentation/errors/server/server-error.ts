import { BaseError } from "../base/base-error";

export class ServerError extends BaseError {
    constructor (stack?: string) {
        super("ServerError", ["Internal server log"]);

        if (stack) this.stack = stack;
    }
}
