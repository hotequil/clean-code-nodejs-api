import { EmailValidator } from "../../../presentation/protocols/email-validator";
import { makeLoginValidationComposite } from "./login-validation-composite";
import { EmailValidation, ValidationComposite, RequiredFieldValidation } from "../../../presentation/validators";

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
