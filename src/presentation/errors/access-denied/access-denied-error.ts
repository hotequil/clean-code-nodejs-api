import { BaseError } from "../base/base-error";

export class AccessDeniedError extends BaseError {
    constructor () {
        super("AccessDeniedError", ["Access denied"]);
    }
}
