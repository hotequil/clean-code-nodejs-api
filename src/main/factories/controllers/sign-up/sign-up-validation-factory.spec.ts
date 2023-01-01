import { makeSignUpValidationComposite } from "./sign-up-validation-factory";
import { CompareFieldsValidation, EmailValidation, RequiredFieldValidation, ValidationComposite } from "../../../../validation/validators";
import { EmailValidator } from "../../../../validation/protocols/email-validator";

jest.mock("../../../../validation/validators/validation-composite");

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
