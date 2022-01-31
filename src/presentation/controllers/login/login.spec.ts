import StatusCode from "status-code-enum";

import { LoginController } from "./login";
import { badRequest } from "../../helpers/http-helper";
import { MissingParamsError } from "../../errors";
import { HttpRequest } from "../../protocols";

describe("LoginController", () => {
    let loginController: LoginController;

    beforeEach(() => loginController = new LoginController());

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
});
