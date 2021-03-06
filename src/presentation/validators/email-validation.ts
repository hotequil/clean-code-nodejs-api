import { Validation } from "../protocols/validation";
import { EmailValidator } from "../protocols/email-validator";
import { AnyObject } from "../../utils/helpers";
import { InvalidParamsError } from "../errors";

export class EmailValidation implements Validation {
    constructor (private readonly fieldName: string, private readonly emailValidator: EmailValidator) {}

    validate (value: AnyObject): Error|null {
        if (!this.emailValidator.isValid(value[this.fieldName]))
            return new InvalidParamsError(this.fieldName);

        return null;
    }
}
