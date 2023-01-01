import { EmailValidation, RequiredFieldValidation, ValidationComposite } from "../../../../validation/validators";
import { EmailValidatorAdapter } from "../../../../infra/validators/email-validator-adapter";

export const makeLoginValidationComposite = (): ValidationComposite => new ValidationComposite([
    new RequiredFieldValidation("email"),
    new RequiredFieldValidation("password"),
    new EmailValidation("email", new EmailValidatorAdapter())
]);
