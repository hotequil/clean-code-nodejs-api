import { Validation } from "../../presentation/protocols";
import { AnyObject } from "../../utils/helpers";

export class ValidationComposite implements Validation {
    constructor (private readonly validations: Validation[]) {}

    validate (value: AnyObject): Error|null {
        for (const validation of this.validations) {
            const error = validation.validate(value);

            if (error instanceof Error) return error;
        }

        return null;
    }
}
