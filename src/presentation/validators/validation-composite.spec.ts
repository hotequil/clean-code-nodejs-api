import { ValidationComposite } from "./validation-composite";
import { MissingParamsError } from "../errors";
import { Validation } from "./validation";
import { AnyObject } from "../../utils/helpers";

let validation: ValidationComposite;
let validations: Validation[];

class ValidationStub implements Validation {
    validate (value: AnyObject): Error|null {
        console.log(value);

        return null;
    }
}

describe("ValidationComposite", () => {
    beforeEach(() => {
        validations = [new ValidationStub(), new ValidationStub()];
        validation = new ValidationComposite(validations);
    });

    it("Should return an error if any validate throw when was called", () => {
        const value = new MissingParamsError("id");
        const secondValidation = validations[1];

        jest.spyOn(secondValidation, "validate").mockReturnValueOnce(value);

        const response = validation.validate({});

        expect(response).toEqual(value);
    });

    it("Should return null if all validations are correct when was called", () => {
        const response = validation.validate({});

        expect(response).toBe(null);
    });
});
