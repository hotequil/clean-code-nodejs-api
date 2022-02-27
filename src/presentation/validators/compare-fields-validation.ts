import { Validation } from "./validation";
import { AnyObject } from "../../utils/helpers";
import { InvalidParamsError } from "../errors";

export class CompareFieldsValidation implements Validation {
    constructor (private readonly firstField: string, private readonly secondField: string) {}

    validate (value: AnyObject): InvalidParamsError|null {
        if (value[this.firstField] !== value[this.secondField])
            return new InvalidParamsError(this.secondField);

        return null;
    }
}
