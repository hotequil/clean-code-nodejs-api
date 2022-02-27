import { RequiredFieldValidation } from "./required-field-validation";
import { MissingParamsError } from "../errors";

describe("RequiredFieldValidation", () => {
    it("Should return a MissingParamsError if validate is invalid when was called", () => {
        const FIELD = "name";
        const validation = new RequiredFieldValidation(FIELD);
        const response = validation.validate({});

        expect(response).toEqual(new MissingParamsError(FIELD));
    });
});
