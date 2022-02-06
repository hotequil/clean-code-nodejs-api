import { ValidationComposite } from "../../../presentation/validators/validation-composite";
import { RequiredFieldValidation } from "../../../presentation/validators/required-field-validation";

export const makeSignUpValidationComposite = (): ValidationComposite => new ValidationComposite([
    new RequiredFieldValidation("name"),
    new RequiredFieldValidation("email"),
    new RequiredFieldValidation("password"),
    new RequiredFieldValidation("passwordConfirmation")
]);
