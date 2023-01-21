import { StatusCode } from "status-code-enum";
import { InvalidParamsError } from "@/presentation/errors";
import { EmailValidation } from "./email-validation";
import { EmailValidator } from "../protocols/email-validator";
import { mockEmailValidator } from "@/utils/tests";

let controller: EmailValidation;
let emailValidatorStub: EmailValidator;
const FIELD_NAME = "email";
const mockData = (): { email: string } => ({ [FIELD_NAME]: "email@email.email" });

describe("EmailValidation", () => {
    beforeEach(() => {
        emailValidatorStub = mockEmailValidator();
        controller = new EmailValidation(FIELD_NAME, emailValidatorStub);
    });

    it(`Should return code ${StatusCode.ClientErrorBadRequest} when email is not valid`, () => {
        jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);

        const response = controller.validate(mockData());

        expect(response).toEqual(new InvalidParamsError(FIELD_NAME));
    });

    it("Should receive a valid email when EmailValidator was called", () => {
        const isValidSpy = jest.spyOn(emailValidatorStub, "isValid");
        const value = mockData();
        const { email } = value;

        controller.validate(value);

        expect(isValidSpy).toHaveBeenCalledWith(email);
    });
});
