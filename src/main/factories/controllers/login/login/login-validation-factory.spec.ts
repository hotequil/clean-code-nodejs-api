import { EmailValidator } from "@/validation/protocols/email-validator";
import { makeLoginValidationComposite } from "./login-validation-factory";
import { EmailValidation, ValidationComposite, RequiredFieldValidation } from "@/validation/validators";

jest.mock("../../../../../validation/validators/validation-composite");

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
