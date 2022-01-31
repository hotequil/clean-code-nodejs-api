import StatusCode from "status-code-enum";

import { LoginController } from "./login";
import { badRequest } from "../../helpers/http-helper";
import { InvalidParamsError, MissingParamsError } from "../../errors";
import { HttpRequest, HttpResponse } from "../../protocols";
import { EmailValidator } from "../../protocols/email-validator";

class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
        console.log(email);

        return true;
    }
}

describe("LoginController", () => {
    let loginController: LoginController;
    let emailValidator: EmailValidator;

    beforeEach(() => {
        emailValidator = new EmailValidatorStub();
        loginController = new LoginController(emailValidator);
    });

    it(`Should return code ${StatusCode.ClientErrorBadRequest} if email is not provided when was called`, async () => {
        const request: HttpRequest = { body: { password: "password" } };
        const response = await loginController.handle(request);

        expect(response).toEqual(badRequest(new MissingParamsError("email")));
    });

    it(`Should return code ${StatusCode.ClientErrorBadRequest} if password is not provided when was called`, async () => {
        const request: HttpRequest = { body: { email: "email@email.email" } };
        const response = await loginController.handle(request);

        expect(response).toEqual(badRequest(new MissingParamsError("password")));
    });

    it("Should call EmailValidator with a correct email when was called", async () => {
        const isValid = jest.spyOn(emailValidator, "isValid");
        const email = "email@email.email";

        const request: HttpRequest = {
            body: {
                email,
                password: "password"
            }
        };

        await loginController.handle(request);

        expect(isValid).toHaveBeenCalledWith(email);
    });

    it("Should call EmailValidator if email is not valid when was called", async () => {
        jest.spyOn(emailValidator, "isValid").mockReturnValueOnce(false);

        const request: HttpRequest = {
            body: {
                email: "invalid-email",
                password: "password"
            }
        };

        const response: HttpResponse = await loginController.handle(request);

        expect(response).toEqual(badRequest(new InvalidParamsError("email")));
    });
});
