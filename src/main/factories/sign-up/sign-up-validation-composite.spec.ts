import { makeSignUpValidationComposite } from "./sign-up-validation-composite";
import { ValidationComposite } from "../../../presentation/validators/validation-composite";
import { RequiredFieldValidation } from "../../../presentation/validators/required-field-validation";

jest.mock("../../../presentation/validators/validation-composite");

describe("SignUpValidationComposite", () => {
    it("Should call ValidationComposite with all validations when was called", () => {
        makeSignUpValidationComposite();

        expect(ValidationComposite).toHaveBeenCalledWith([
            new RequiredFieldValidation("name"),
            new RequiredFieldValidation("email"),
            new RequiredFieldValidation("password"),
            new RequiredFieldValidation("passwordConfirmation")
        ]);
    });
});
