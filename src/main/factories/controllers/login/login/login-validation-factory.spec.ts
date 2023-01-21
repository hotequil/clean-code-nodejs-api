import { makeLoginValidationComposite } from "./login-validation-factory";
import { EmailValidation, ValidationComposite, RequiredFieldValidation } from "@/validation/validators";
import { mockEmailValidator } from "@/utils/tests";

jest.mock("@/validation/validators/validation-composite");

describe("LoginValidationComposite", () => {
    it("Should call ValidationComposite with all validations when was called", () => {
        makeLoginValidationComposite();

        expect(ValidationComposite).toHaveBeenCalledWith([
            new RequiredFieldValidation("email"),
            new RequiredFieldValidation("password"),
            new EmailValidation("email", mockEmailValidator())
        ]);
    });
});
