import { ValidationComposite } from "./validation-composite";
import { InvalidParamsError, MissingParamsError } from "../errors";
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

    it("Should return first error if there are more errors when was called", () => {
        const firstError = new InvalidParamsError("name");
        const firstValidation = validations[0];
        const secondValidation = validations[1];

        jest.spyOn(firstValidation, "validate").mockReturnValueOnce(firstError);
        jest.spyOn(secondValidation, "validate").mockReturnValueOnce(new MissingParamsError("email"));

        const response = validation.validate({});

        expect(response).toEqual(firstError);
    });

    it("Should return null if all validations are correct when was called", () => {
        const response = validation.validate({});

        expect(response).toBe(null);
    });
});
