export class BaseError extends Error {
    constructor (name: string, errors: string[]) {
        super(`Missing ${errors.length >= 2 ? "params" : "param"}: ${errors.join(", ")}`)

        this.name = name;
    }
}
