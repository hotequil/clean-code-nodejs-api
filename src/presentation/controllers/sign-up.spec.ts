import { StatusCode } from "status-code-enum";

import { SignUpController } from "./sign-up";
import { HttpRequest } from "../protocols/http";
import { MissingParamsError } from "../errors/missing-params-error";

let controller: SignUpController;

describe("SignUpController", () => {
    beforeEach(() => controller = new SignUpController());

    it(`Should return code ${StatusCode.ClientErrorBadRequest} when name is not provided`, () => {
        const request: HttpRequest = {
            body: {
                email: "email@email.email",
                password: "passwordAndConfirmation",
                passwordConfirmation: "passwordAndConfirmation"
            }
        };

        const { body, statusCode } = controller.handle(request);

        expect(statusCode).toBe(StatusCode.ClientErrorBadRequest);
        expect(body).toEqual(new MissingParamsError("name"));
    });

    it(`Should return code ${StatusCode.ClientErrorBadRequest} when email is not provided`, () => {
        const request: HttpRequest = {
            body: {
                name: "name@name.name",
                password: "passwordAndConfirmation",
                passwordConfirmation: "passwordAndConfirmation"
            }
        };

        const { statusCode, body } = controller.handle(request);

        expect(statusCode).toBe(StatusCode.ClientErrorBadRequest);
        expect(body).toEqual(new MissingParamsError("email"));
    });

    it(`Should return code ${StatusCode.SuccessOK} when all fields was provided`, () => {
        const request: HttpRequest = {
            body: {
                name: "name@name.name",
                email: "email@email.email",
                password: "passwordAndConfirmation",
                passwordConfirmation: "passwordAndConfirmation"
            }
        };

        const { statusCode } = controller.handle(request);

        expect(statusCode).toBe(StatusCode.SuccessOK);
    });
});
