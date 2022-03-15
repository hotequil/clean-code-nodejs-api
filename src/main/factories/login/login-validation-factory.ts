import { EmailValidation, RequiredFieldValidation, ValidationComposite } from "../../../presentation/validators";
import { EmailValidatorAdapter } from "../../adapters/validators/email-validator-adapter";

export const makeLoginValidationComposite = (): ValidationComposite => new ValidationComposite([
    new RequiredFieldValidation("email"),
    new RequiredFieldValidation("password"),
    new EmailValidation("email", new EmailValidatorAdapter())
]);
