import { EmailValidation, CompareFieldsValidation, RequiredFieldValidation, ValidationComposite } from "../../../presentation/validators";
import { EmailValidatorAdapter } from "../../adapters/validators/email-validator-adapter";

export const makeSignUpValidationComposite = (): ValidationComposite => new ValidationComposite([
    new RequiredFieldValidation("name"),
    new RequiredFieldValidation("email"),
    new RequiredFieldValidation("password"),
    new RequiredFieldValidation("passwordConfirmation"),
    new CompareFieldsValidation("password", "passwordConfirmation"),
    new EmailValidation("email", new EmailValidatorAdapter())
]);
