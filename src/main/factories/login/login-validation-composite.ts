import { ValidationComposite } from "../../../presentation/validators/validation-composite";
import { RequiredFieldValidation } from "../../../presentation/validators/required-field-validation";
import { EmailValidation } from "../../../presentation/validators/email-validation";
import { EmailValidatorAdapter } from "../../../utils/adapters/email-validator/email-validator-adapter";

export const makeLoginValidationComposite = (): ValidationComposite => new ValidationComposite([
    new RequiredFieldValidation("email"),
    new RequiredFieldValidation("password"),
    new EmailValidation("email", new EmailValidatorAdapter())
]);
