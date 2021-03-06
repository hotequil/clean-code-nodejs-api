import { BaseError } from "../base/base-error";

export class MissingParamsError extends BaseError {
    constructor (...errors: string[]) {
        super("MissingParamsError", errors);
    }
}
