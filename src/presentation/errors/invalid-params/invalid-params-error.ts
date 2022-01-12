import { BaseError } from "../base/base-error";

export class InvalidParamsError extends BaseError {
    constructor (...errors: string[]) {
        super("InvalidParamsError", errors);
    }
}
