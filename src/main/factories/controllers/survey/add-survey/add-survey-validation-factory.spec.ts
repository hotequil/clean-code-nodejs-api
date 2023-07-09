import { makeAddSurveyValidationComposite } from "./add-survey-validation-factory";
import { ValidationComposite, RequiredFieldValidation } from "@/validation/validators";

jest.mock("@/validation/validators/validation-composite");

describe("AddSurveyValidationComposite", () => {
    it("Should call ValidationComposite with all validations when was called", () => {
        makeAddSurveyValidationComposite();

        expect(ValidationComposite).toHaveBeenCalledWith([
            new RequiredFieldValidation("question"),
            new RequiredFieldValidation("answers")
        ]);
    });
});
