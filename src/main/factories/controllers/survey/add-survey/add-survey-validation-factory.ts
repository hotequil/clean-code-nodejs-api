import { RequiredFieldValidation, ValidationComposite } from "../../../../../validation/validators";

export const makeAddSurveyValidationComposite = (): ValidationComposite => new ValidationComposite([
    new RequiredFieldValidation("question"),
    new RequiredFieldValidation("answers"),
]);
