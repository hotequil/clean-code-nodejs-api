import { type Validation } from "@/presentation/protocols";
import { type EmailValidator } from "../protocols/email-validator";
import { type AnyObject } from "@/utils/helpers";
import { InvalidParamsError } from "@/presentation/errors";

export class EmailValidation implements Validation {
    constructor (private readonly fieldName: string, private readonly emailValidator: EmailValidator) {}

    validate (value: AnyObject): Error | null {
        if (!this.emailValidator.isValid(value[this.fieldName]))
            return new InvalidParamsError(this.fieldName);

        return null;
    }
}
