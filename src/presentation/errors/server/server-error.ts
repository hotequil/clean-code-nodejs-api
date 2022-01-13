import { BaseError } from "../base/base-error";

export class ServerError extends BaseError {
    constructor () {
        super("ServerError", ["Internal server error"]);
    }
}
