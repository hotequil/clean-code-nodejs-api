export class MissingParamsError extends Error {
    constructor (...errors: string[]) {
        super(`Missing ${errors.length >= 2 ? "params" : "param"}: ${errors.join(", ")}`);

        this.name = "MissingParamsError";
    }
}
