import { BaseError } from "../base/base-error";

export class MissingParamsError extends BaseError {
    constructor (name: string, ...errors: string[]) {
        super(name, errors);
    }
}
