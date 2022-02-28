import { ValidationComposite } from "./validation-composite";
import { MissingParamsError } from "../errors";
import { Validation } from "./validation";
import { AnyObject } from "../../utils/helpers";

let validation: ValidationComposite;
const FIELD = "id";

class ValidationStub implements Validation {
    validate (value: AnyObject): MissingParamsError|null {
        console.log(value);

        return null;
    }
}

describe("ValidationComposite", () => {
    beforeEach(() => validation = new ValidationComposite([new ValidationStub()]));

    it("Should return an error if any validate throw when was called", () => {
        const value = new MissingParamsError(FIELD);

        jest.spyOn(validation, "validate").mockReturnValueOnce(value);

        const response = validation.validate({});

        expect(response).toEqual(value);
    });

    it("Should return null if all validations are correct when was called", () => {
        const response = validation.validate({});

        expect(response).toBe(null);
    });
});
