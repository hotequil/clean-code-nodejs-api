import { makeSignUpValidationComposite } from "./sign-up-validation-composite";
import { ValidationComposite } from "../../../presentation/validators/validation-composite";
import { RequiredFieldValidation } from "../../../presentation/validators/required-field-validation";
import { CompareFieldsValidation } from "../../../presentation/validators/compare-fields-validation";
import { EmailValidation } from "../../../presentation/validators/email-validation";
import { EmailValidator } from "../../../presentation/protocols/email-validator";

jest.mock("../../../presentation/validators/validation-composite");

class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
        console.log(email);

        return true;
    }
}

describe("SignUpValidationComposite", () => {
    it("Should call ValidationComposite with all validations when was called", () => {
        makeSignUpValidationComposite();

        expect(ValidationComposite).toHaveBeenCalledWith([
            new RequiredFieldValidation("name"),
            new RequiredFieldValidation("email"),
            new RequiredFieldValidation("password"),
            new RequiredFieldValidation("passwordConfirmation"),
            new CompareFieldsValidation("password", "passwordConfirmation"),
            new EmailValidation("email", new EmailValidatorStub())
        ]);
    });
});
