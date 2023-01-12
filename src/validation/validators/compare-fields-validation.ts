import { Validation } from "@/presentation/protocols";
import { AnyObject } from "@/utils/helpers";
import { InvalidParamsError } from "@/presentation/errors";

export class CompareFieldsValidation implements Validation {
    constructor (private readonly firstField: string, private readonly secondField: string) {}

    validate (value: AnyObject): InvalidParamsError|null {
        if (value[this.firstField] !== value[this.secondField])
            return new InvalidParamsError(this.secondField);

        return null;
    }
}
