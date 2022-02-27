import { CompareFieldsValidation } from "./compare-fields-validation";
import { InvalidParamsError } from "../errors";

let validation: CompareFieldsValidation;
const FIRST_FIELD = "password";
const SECOND_FIELD = "passwordConfirmation";

describe("CompareFieldsValidation", () => {
    beforeEach(() => validation = new CompareFieldsValidation(FIRST_FIELD, SECOND_FIELD));

    it("Should return an InvalidParamsError if fields are different when validate was called", () => {
        const response = validation.validate({ [FIRST_FIELD]: 123, [SECOND_FIELD]: 123456 });

        expect(response).toEqual(new InvalidParamsError(SECOND_FIELD));
    });
});
