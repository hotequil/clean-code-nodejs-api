import { StatusCode } from "status-code-enum";
import { SignUpController } from "./sign-up-controller";
import { AddAccount, Authentication, HttpResponse } from "./sign-up-controller-protocols";
import { MissingParamsError, ServerError } from "../../../errors";
import { badRequest, forbidden, serverError, success } from "../../../helpers/http-helper";
import { Validation } from "@/presentation/protocols";
import { EmailInUseError } from "../../../errors/email-in-use/email-in-use-error";
import { mockAddAccount, mockAddAccountParams, mockValidation, throwError } from "@/utils/tests";
import { mockAuthentication } from "@/utils/tests/authentication";

const TOKEN = "any-token";
const NAME = "user-name";
let controller: SignUpController;
let addAccountStub: AddAccount;
let validationStub: Validation;
let authenticationStub: Authentication;

const mockRequest = (): SignUpController.Request => ({
    ...mockAddAccountParams("passwordAndConfirmation"),
    passwordConfirmation: "passwordAndConfirmation",
});

describe("SignUpController", () => {
    beforeEach(() => {
        addAccountStub = mockAddAccount();
        validationStub = mockValidation();
        authenticationStub = mockAuthentication(TOKEN, NAME);
        controller = new SignUpController(addAccountStub, validationStub, authenticationStub);
    });

    it(`Should return an AddAccount exception with code ${StatusCode.ServerErrorInternal} when was called`, async () => {
        jest.spyOn(addAccountStub, "add").mockImplementationOnce(throwError)

        const request = mockRequest();
        const response = await controller.handle(request);

        expect(response).toEqual(serverError(new ServerError()));
    });

    it("Should call AddAccount with correct values when was called", async () => {
        const name = "name";
        const email = "email@email.email";
        const password = "passwordAndConfirmation";
        const addSpy = jest.spyOn(addAccountStub, "add");

        const request: SignUpController.Request = {
            name,
            email,
            password,
            passwordConfirmation: password
        };

        await controller.handle(request);

        expect(addSpy).toHaveBeenCalledWith({ name, email, password })
    });

    it("Should call Validation with correct values when was called", async () => {
        const spy = jest.spyOn(validationStub, "validate");
        const request = mockRequest();

        await controller.handle(request);

        expect(spy).toHaveBeenCalledWith(request);
    });

    it(`Should return code ${StatusCode.ClientErrorBadRequest} if Validation throws an error when was called`, async () => {
        const error = new MissingParamsError("field");

        jest.spyOn(validationStub, "validate").mockReturnValueOnce(error);

        const request = mockRequest();
        const response = await controller.handle(request);

        expect(response).toEqual(badRequest(error));
    })

    it("Should call Authentication with correct values", async () => {
        const request = mockRequest();
        const { email, password } = request;
        const spy = jest.spyOn(authenticationStub, "auth");

        await controller.handle(request);

        expect(spy).toHaveBeenCalledWith({ email, password });
    })

    it(`Should return code ${StatusCode.ServerErrorInternal} if Authentication throws when was called`, async () => {
        jest.spyOn(authenticationStub, "auth").mockImplementationOnce(throwError)

        const request = mockRequest()
        const response: HttpResponse = await controller.handle(request)

        expect(response).toEqual(serverError(new ServerError()))
    });

    it(`Should return code ${StatusCode.SuccessOK} when was called with token object (AuthenticationModel)`, async () => {
        const request = mockRequest();
        const response: HttpResponse = await controller.handle(request);

        expect(response).toEqual(success({ token: { token: TOKEN, name: NAME } }));
    });

    it(`Should return code ${StatusCode.ClientErrorForbidden} if AddAccount returns null`, async () => {
        jest.spyOn(addAccountStub, "add").mockReturnValueOnce(Promise.resolve(null));

        const request = mockRequest();
        const response: HttpResponse = await controller.handle(request);

        expect(response).toEqual(forbidden(new EmailInUseError()))
    });
});
