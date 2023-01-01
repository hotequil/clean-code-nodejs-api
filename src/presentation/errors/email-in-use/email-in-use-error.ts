import { BaseError } from "../base/base-error";

export class EmailInUseError extends BaseError {
    constructor () {
        super("EmailInUseError", ["The received email is already in use"]);
    }
}
