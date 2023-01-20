import { StatusCode } from "status-code-enum";
import { SignUpController } from "./sign-up-controller";
import {
    HttpRequest,
    AccountModel,
    AddAccount,
    AddAccountParams,
    Authentication,
    AuthenticationParams,
    HttpResponse
} from "./sign-up-controller-protocols";
import { MissingParamsError, ServerError } from "../../../errors";
import { badRequest, forbidden, serverError, success } from "../../../helpers/http-helper";
import { Validation } from "@/presentation/protocols";
import { AnyObject } from "@/utils/helpers";
import { EmailInUseError } from "../../../errors/email-in-use/email-in-use-error";
import { throwError } from "@/utils/tests";

const TOKEN = "any-token";
let controller: SignUpController;
let addAccountStub: AddAccount;
let validationStub: Validation;
let authenticationStub: Authentication;

const makeDefaultHttpRequest = (): HttpRequest => (
    {
        body: {
            name: "name",
            email: "email@email.email",
            password: "passwordAndConfirmation",
            passwordConfirmation: "passwordAndConfirmation"
        }
    }
);

class AddAccountStub implements AddAccount {
    async add (account: AddAccountParams): Promise<AccountModel> {
        return await new Promise(resolve => resolve({ ...account, id: "id" }));
    }
}

class ValidationStub implements Validation {
    validate (value: AnyObject): Error|null {
        console.log(value);

        return null;
    }
}

class AuthenticationStub implements Authentication {
    async auth (model: AuthenticationParams): Promise<string|null> {
        console.log(model)

        return await new Promise(resolve => resolve(TOKEN))
    }
}

describe("SignUpController", () => {
    beforeEach(() => {
        addAccountStub = new AddAccountStub();
        validationStub = new ValidationStub();
        authenticationStub = new AuthenticationStub();
        controller = new SignUpController(addAccountStub, validationStub, authenticationStub);
    });

    it(`Should return an AddAccount exception with code ${StatusCode.ServerErrorInternal} when was called`, async () => {
        jest.spyOn(addAccountStub, "add").mockImplementationOnce(throwError)

        const request = makeDefaultHttpRequest();
        const response = await controller.handle(request);

        expect(response).toEqual(serverError(new ServerError()));
    });

    it("Should call AddAccount with correct values when was called", async () => {
        const name = "name";
        const email = "email@email.email";
        const password = "passwordAndConfirmation";
        const addSpy = jest.spyOn(addAccountStub, "add");

        const request = {
            body: {
                name,
                email,
                password,
                passwordConfirmation: password
            }
        };

        await controller.handle(request);

        expect(addSpy).toHaveBeenCalledWith({ name, email, password })
    });

    it("Should call Validation with correct values when was called", async () => {
        const spy = jest.spyOn(validationStub, "validate");
        const request = makeDefaultHttpRequest();

        await controller.handle(request);

        expect(spy).toHaveBeenCalledWith(request.body);
    });

    it(`Should return code ${StatusCode.ClientErrorBadRequest} if Validation throws an error when was called`, async () => {
        const error = new MissingParamsError("field");

        jest.spyOn(validationStub, "validate").mockReturnValueOnce(error);

        const request = makeDefaultHttpRequest();
        const response = await controller.handle(request);

        expect(response).toEqual(badRequest(error));
    })

    it("Should call Authentication with correct values", async () => {
        const request: HttpRequest = makeDefaultHttpRequest();
        const spy = jest.spyOn(authenticationStub, "auth");

        await controller.handle(request);

        expect(spy).toHaveBeenCalledWith({ email: request.body.email, password: request.body.password });
    })

    it(`Should return code ${StatusCode.ServerErrorInternal} if Authentication throws when was called`, async () => {
        jest.spyOn(authenticationStub, "auth").mockImplementationOnce(throwError)

        const request: HttpRequest = makeDefaultHttpRequest()
        const response: HttpResponse = await controller.handle(request)

        expect(response).toEqual(serverError(new ServerError()))
    });

    it(`Should return code ${StatusCode.SuccessOK} when was called with token`, async () => {
        const request: HttpRequest = makeDefaultHttpRequest();
        const response: HttpResponse = await controller.handle(request);

        expect(response).toEqual(success({ token: TOKEN }));
    });

    it(`Should return code ${StatusCode.ClientErrorForbidden} if AddAccount returns null`, async () => {
        jest.spyOn(addAccountStub, "add").mockReturnValueOnce(new Promise(resolve => resolve(null)));

        const request: HttpRequest = makeDefaultHttpRequest();
        const response: HttpResponse = await controller.handle(request);

        expect(response).toEqual(forbidden(new EmailInUseError()))
    });
});
