import StatusCode from "status-code-enum";
import { LoginController } from "./login-controller";
import { badRequest, serverError, success, unauthorized } from "../../../helpers/http-helper";
import { MissingParamsError, ServerError } from "../../../errors";
import {
    HttpRequest,
    HttpResponse,
    Authentication,
    Validation,
    AnyObject,
    AuthenticationModel
} from "./login-controller-protocols";

const TOKEN = "token";

const makeHttpRequest = (): HttpRequest => (
    {
        body: {
            email: "email@email.email",
            password: "password"
        }
    }
);

class AuthenticationStub implements Authentication {
    async auth (model: AuthenticationModel): Promise<string|null> {
        console.log(model);

        return await new Promise(resolve => resolve(TOKEN));
    }
}

class ValidationStub implements Validation {
    validate (value: AnyObject): Error|null {
        console.log(value);

        return null;
    }
}

describe("LoginController", () => {
    let loginController: LoginController;
    let authentication: Authentication;
    let validationStub: ValidationStub;

    beforeEach(() => {
        authentication = new AuthenticationStub();
        validationStub = new ValidationStub();
        loginController = new LoginController(authentication, validationStub);
    });

    it("Should call Authentication with correct values", async () => {
        const request: HttpRequest = makeHttpRequest();
        const spy = jest.spyOn(authentication, "auth");

        await loginController.handle(request);

        expect(spy).toHaveBeenCalledWith({ email: request.body.email, password: request.body.password });
    });

    it(`Should return code ${StatusCode.ClientErrorUnauthorized} if auth is invalid when was called`, async () => {
        jest.spyOn(authentication, "auth").mockReturnValueOnce(new Promise(resolve => resolve("")));

        const request: HttpRequest = makeHttpRequest();
        const response = await loginController.handle(request);

        expect(response).toEqual(unauthorized());
    });

    it(`Should return code ${StatusCode.ServerErrorInternal} if Authentication throws when was called`, async () => {
        jest.spyOn(authentication, "auth").mockImplementationOnce(() => { throw new Error(); });

        const request: HttpRequest = makeHttpRequest();
        const response: HttpResponse = await loginController.handle(request);

        expect(response).toEqual(serverError(new ServerError()))
    });

    it(`Should return code ${StatusCode.SuccessOK} when was called with correct values`, async () => {
        const request: HttpRequest = makeHttpRequest();
        const response: HttpResponse = await loginController.handle(request);

        expect(response).toEqual(success({ token: TOKEN }));
    });

    it("Should call Validation with correct values when was called", async () => {
        const spy = jest.spyOn(validationStub, "validate");
        const request = makeHttpRequest();

        await loginController.handle(request);

        expect(spy).toHaveBeenCalledWith(request.body);
    });

    it(`Should return code ${StatusCode.ClientErrorBadRequest} if Validation throws an error when was called`, async () => {
        const error = new MissingParamsError("field");

        jest.spyOn(validationStub, "validate").mockReturnValueOnce(error);

        const request = makeHttpRequest();
        const response = await loginController.handle(request);

        expect(response).toEqual(badRequest(error));
    });
});
