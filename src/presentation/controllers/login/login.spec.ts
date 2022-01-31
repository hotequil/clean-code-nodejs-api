import StatusCode from "status-code-enum";

import { LoginController } from "./login";
import { badRequest } from "../../helpers/http-helper";
import { MissingParamsError } from "../../errors";

describe("LoginController", () => {
    let loginController: LoginController;

    beforeEach(() => loginController = new LoginController());

    it(`Should return code ${StatusCode.ClientErrorBadRequest} if email is not provided when was called`, async () => {
        const request = { body: { password: "password" } };
        const response = await loginController.handle(request);

        expect(response).toEqual(badRequest(new MissingParamsError("email")));
    });
});
