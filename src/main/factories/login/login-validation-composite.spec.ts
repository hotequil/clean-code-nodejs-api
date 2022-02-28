import { EmailValidator } from "../../../presentation/protocols/email-validator";
import { makeLoginValidationComposite } from "./login-validation-composite";
import { RequiredFieldValidation } from "../../../presentation/validators/required-field-validation";
import { EmailValidation } from "../../../presentation/validators/email-validation";
import { ValidationComposite } from "../../../presentation/validators/validation-composite";

jest.mock("../../../presentation/validators/validation-composite");

class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
        console.log(email);

        return true;
    }
}

describe("LoginValidationComposite", () => {
    it("Should call ValidationComposite with all validations when was called", () => {
        makeLoginValidationComposite();

        expect(ValidationComposite).toHaveBeenCalledWith([
            new RequiredFieldValidation("email"),
            new RequiredFieldValidation("password"),
            new EmailValidation("email", new EmailValidatorStub())
        ]);
    });
});
