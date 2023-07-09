import StatusCode from "status-code-enum";
import { LoginController } from "./login-controller";
import { badRequest, serverError, success, unauthorized } from "../../../helpers/http-helper";
import { MissingParamsError, ServerError } from "../../../errors";
import { type HttpResponse, type Authentication, type Validation } from "./login-controller-protocols";
import { mockValidation, throwError } from "@/utils/tests";
import { mockAuthentication } from "@/utils/tests/authentication";

const TOKEN = "token";
const NAME = "name";

const mockRequest = (): LoginController.Request => (
    {
        email: "email@email.email",
        password: "password"
    }
);

describe("LoginController", () => {
    let loginController: LoginController;
    let authentication: Authentication;
    let validationStub: Validation;

    beforeEach(() => {
        authentication = mockAuthentication(TOKEN, NAME);
        validationStub = mockValidation();
        loginController = new LoginController(authentication, validationStub);
    });

    it("Should call Authentication with correct values", async () => {
        const request = mockRequest();
        const { email, password } = request;
        const spy = jest.spyOn(authentication, "auth");

        await loginController.handle(request);

        expect(spy).toHaveBeenCalledWith({ email, password });
    });

    it(`Should return code ${StatusCode.ClientErrorUnauthorized} if auth is invalid when was called`, async () => {
        jest.spyOn(authentication, "auth").mockReturnValueOnce(Promise.resolve(null));

        const request = mockRequest();
        const response = await loginController.handle(request);

        expect(response).toEqual(unauthorized());
    });

    it(`Should return code ${StatusCode.ServerErrorInternal} if Authentication throws when was called`, async () => {
        jest.spyOn(authentication, "auth").mockImplementationOnce(throwError);

        const request = mockRequest();
        const response: HttpResponse = await loginController.handle(request);

        expect(response).toEqual(serverError(new ServerError()))
    });

    it(`Should return code ${StatusCode.SuccessOK} when was called with correct values`, async () => {
        const request = mockRequest();
        const response: HttpResponse = await loginController.handle(request);

        expect(response).toEqual(success({ token: { token: TOKEN, name: NAME } }));
    });

    it("Should call Validation with correct values when was called", async () => {
        const spy = jest.spyOn(validationStub, "validate");
        const request = mockRequest();

        await loginController.handle(request);

        expect(spy).toHaveBeenCalledWith(request);
    });

    it(`Should return code ${StatusCode.ClientErrorBadRequest} if Validation throws an error when was called`, async () => {
        const error = new MissingParamsError("field");

        jest.spyOn(validationStub, "validate").mockReturnValueOnce(error);

        const request = mockRequest();
        const response = await loginController.handle(request);

        expect(response).toEqual(badRequest(error));
    });
});
