import { StatusCode } from "status-code-enum";

import { SignUpController } from "./sign-up";
import { HttpRequest, EmailValidator } from "../protocols";
import { InvalidParamsError, ServerError, MissingParamsError } from "../errors";
import { AddAccount, AddAccountModel } from "../../domain/use-cases/add-account";
import { AccountModel } from "../../domain/models/account";

let controller: SignUpController;
let emailValidatorStub: EmailValidator;
let addAccountStub: AddAccount;

class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
        console.log(email);

        return true;
    }
}

class AddAccountStub implements AddAccount {
    add (account: AddAccountModel): AccountModel {
        return {
            ...account,
            id: "id"
        };
    }
}

describe("SignUpController", () => {
    beforeEach(() => {
        emailValidatorStub = new EmailValidatorStub();
        addAccountStub = new AddAccountStub();
        controller = new SignUpController(emailValidatorStub, addAccountStub);
    });

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
                name: "name",
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
                name: "name",
                email: "email@email.email",
                password: "passwordAndConfirmation",
                passwordConfirmation: "passwordAndConfirmation"
            }
        };

        const { statusCode } = controller.handle(request);

        expect(statusCode).toBe(StatusCode.SuccessOK);
    });

    it(`Should return code ${StatusCode.ClientErrorBadRequest} when password was not provided`, () => {
        const request: HttpRequest = {
            body: {
                name: "name",
                email: "email@email.email",
                passwordConfirmation: "passwordAndConfirmation"
            }
        };

        const { statusCode, body } = controller.handle(request);

        expect(statusCode).toBe(StatusCode.ClientErrorBadRequest);
        expect(body).toEqual(new MissingParamsError("password"));
    });

    it(`Should return code ${StatusCode.ClientErrorBadRequest} when passwordConfirmation was not provided`, () => {
        const request: HttpRequest = {
            body: {
                name: "name",
                email: "email@email.email",
                password: "passwordAndConfirmation"
            }
        };

        const { statusCode, body } = controller.handle(request);

        expect(statusCode).toBe(StatusCode.ClientErrorBadRequest);
        expect(body).toEqual(new MissingParamsError("passwordConfirmation"));
    });

    it(`Should return code ${StatusCode.ClientErrorBadRequest} when email is not valid`, () => {
        jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);

        const request: HttpRequest = {
            body: {
                name: "name",
                email: "invalidEmail",
                password: "passwordAndConfirmation",
                passwordConfirmation: "passwordAndConfirmation"
            }
        };

        const { statusCode, body } = controller.handle(request);

        expect(statusCode).toBe(StatusCode.ClientErrorBadRequest);
        expect(body).toEqual(new InvalidParamsError("email"));
    });

    it(`Should return code ${StatusCode.ClientErrorBadRequest} when password is different passwordConfirmation`, () => {
        const request = {
            body: {
                name: "name",
                email: "email@email.email",
                password: "passwordAndConfirmation",
                passwordConfirmation: "invalidPassword"
            }
        };

        const { statusCode, body } = controller.handle(request);

        expect(statusCode).toBe(StatusCode.ClientErrorBadRequest);
        expect(body).toEqual(new InvalidParamsError("passwordConfirmation"));
    })

    it("Should receive a valid email when EmailValidator was called", () => {
        const isValidSpy = jest.spyOn(emailValidatorStub, "isValid");
        const email = "email@email.email";

        const request: HttpRequest = {
            body: {
                name: "name",
                email,
                password: "passwordAndConfirmation",
                passwordConfirmation: "passwordAndConfirmation"
            }
        };

        controller.handle(request);

        expect(isValidSpy).toHaveBeenCalledWith(email);
    });

    it(`Should throw an exception with code ${StatusCode.ServerErrorInternal} from EmailValidator when was called`, () => {
        jest.spyOn(emailValidatorStub, "isValid")
            .mockImplementationOnce(() => {
                throw new Error()
            });

        const request = {
            body: {
                name: "name",
                email: "email@email.email",
                password: "passwordAndConfirmation",
                passwordConfirmation: "passwordAndConfirmation"
            }
        };

        const { body, statusCode } = controller.handle(request);

        expect(statusCode).toBe(StatusCode.ServerErrorInternal);
        expect(body).toEqual(new ServerError());
    });

    it("Should call AddAccount with correct values when was called", () => {
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

        controller.handle(request);

        expect(addSpy).toHaveBeenCalledWith({ name, email, password })
    });
});
