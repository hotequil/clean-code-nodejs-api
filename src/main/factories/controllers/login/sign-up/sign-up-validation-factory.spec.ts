import { makeSignUpValidationComposite } from "./sign-up-validation-factory";
import { CompareFieldsValidation, EmailValidation, RequiredFieldValidation, ValidationComposite } from "@/validation/validators";
import { mockEmailValidator } from "@/utils/tests";

jest.mock("@/validation/validators/validation-composite");

describe("SignUpValidationComposite", () => {
    it("Should call ValidationComposite with all validations when was called", () => {
        makeSignUpValidationComposite();

        expect(ValidationComposite).toHaveBeenCalledWith([
            new RequiredFieldValidation("name"),
            new RequiredFieldValidation("email"),
            new RequiredFieldValidation("password"),
            new RequiredFieldValidation("passwordConfirmation"),
            new CompareFieldsValidation("password", "passwordConfirmation"),
            new EmailValidation("email", mockEmailValidator())
        ]);
    });
});
