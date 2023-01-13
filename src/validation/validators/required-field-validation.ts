import { Validation } from "@/presentation/protocols";
import { AnyObject } from "@/utils/helpers";
import { MissingParamsError } from "@/presentation/errors";

export class RequiredFieldValidation implements Validation {
    constructor (private readonly fieldName: string) {}

    validate (value: AnyObject): MissingParamsError|null {
        if (!value[this.fieldName]) return new MissingParamsError(this.fieldName);

        return null;
    }
}
