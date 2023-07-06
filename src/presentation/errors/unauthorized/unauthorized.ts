import { BaseError } from "@/presentation/errors";

export class UnauthorizedError extends BaseError {
    constructor () {
        super("UnauthorizedError", ["Unauthorized"]);
    }
}
