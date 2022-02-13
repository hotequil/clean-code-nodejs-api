import { ValidationComposite } from "../../../presentation/validators/validation-composite";
import { RequiredFieldValidation } from "../../../presentation/validators/required-field-validation";
import { CompareFieldsValidation } from "../../../presentation/validators/compare-fields-validation";
import { EmailValidation } from "../../../presentation/validators/email-validation";
import { EmailValidatorAdapter } from "../../../utils/adapters/email-validator/email-validator-adapter";

export const makeSignUpValidationComposite = (): ValidationComposite => new ValidationComposite([
    new RequiredFieldValidation("name"),
    new RequiredFieldValidation("email"),
    new RequiredFieldValidation("password"),
    new RequiredFieldValidation("passwordConfirmation"),
    new CompareFieldsValidation("password", "passwordConfirmation"),
    new EmailValidation("email", new EmailValidatorAdapter())
]);
