import { StatusCode } from "status-code-enum";

import { SignUpController } from "./sign-up";
import { HttpRequest, EmailValidator, AccountModel, AddAccount, AddAccountModel } from "./sign-up-protocols";
import { InvalidParamsError, MissingParamsError, ServerError } from "../../errors";
import { badRequest, serverError } from "../../helpers/http-helper";
import { Validation } from "../../validators/validation";

let controller: SignUpController;
let emailValidatorStub: EmailValidator;
let addAccountStub: AddAccount;
let validationStub: Validation;

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

class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
        console.log(email);

        return true;
    }
}

class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
        return await new Promise(resolve => resolve({ ...account, id: "id" }));
    }
}

class ValidationStub implements Validation {
    validate (value: any): Error|null {
        console.log(value);

        return null;
    }
}

describe("SignUpController", () => {
    beforeEach(() => {
        emailValidatorStub = new EmailValidatorStub();
        addAccountStub = new AddAccountStub();
        validationStub = new ValidationStub();
        controller = new SignUpController(emailValidatorStub, addAccountStub, validationStub);
    });

    it(`Should return code ${StatusCode.ClientErrorBadRequest} when name is not provided`, async () => {
        const request: HttpRequest = {
            body: {
                email: "email@email.email",
                password: "passwordAndConfirmation",
                passwordConfirmation: "passwordAndConfirmation"
            }
        };

        const response = await controller.handle(request);

        expect(response).toEqual(badRequest(new MissingParamsError("name")));
    });

    it(`Should return code ${StatusCode.ClientErrorBadRequest} when email is not provided`, async () => {
        const request: HttpRequest = {
            body: {
                name: "name",
                password: "passwordAndConfirmation",
                passwordConfirmation: "passwordAndConfirmation"
            }
        };

        const response = await controller.handle(request);

        expect(response).toEqual(badRequest(new MissingParamsError("email")));
    });

    it(`Should return code ${StatusCode.SuccessOK} when all fields was provided`, async () => {
        const request: HttpRequest = makeDefaultHttpRequest();
        const { statusCode } = await controller.handle(request);

        expect(statusCode).toBe(StatusCode.SuccessOK);
    });

    it(`Should return code ${StatusCode.ClientErrorBadRequest} when password was not provided`, async () => {
        const request: HttpRequest = {
            body: {
                name: "name",
                email: "email@email.email",
                passwordConfirmation: "passwordAndConfirmation"
            }
        };

        const response = await controller.handle(request);

        expect(response).toEqual(badRequest(new MissingParamsError("password")));
    });

    it(`Should return code ${StatusCode.ClientErrorBadRequest} when passwordConfirmation was not provided`, async () => {
        const request: HttpRequest = {
            body: {
                name: "name",
                email: "email@email.email",
                password: "passwordAndConfirmation"
            }
        };

        const response = await controller.handle(request);

        expect(response).toEqual(badRequest(new MissingParamsError("passwordConfirmation")));
    });

    it(`Should return code ${StatusCode.ClientErrorBadRequest} when email is not valid`, async () => {
        jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);

        const request: HttpRequest = makeDefaultHttpRequest();
        const response = await controller.handle(request);

        expect(response).toEqual(badRequest(new InvalidParamsError("email")));
    });

    it(`Should return code ${StatusCode.ClientErrorBadRequest} when password is different passwordConfirmation`, async () => {
        const request = {
            body: {
                name: "name",
                email: "email@email.email",
                password: "passwordAndConfirmation",
                passwordConfirmation: "invalidPassword"
            }
        };

        const response = await controller.handle(request);

        expect(response).toEqual(badRequest(new InvalidParamsError("passwordConfirmation")));
    })

    it("Should receive a valid email when EmailValidator was called", async () => {
        const isValidSpy = jest.spyOn(emailValidatorStub, "isValid");
        const request: HttpRequest = makeDefaultHttpRequest();
        const { email } = request.body;

        await controller.handle(request);

        expect(isValidSpy).toHaveBeenCalledWith(email);
    });

    it(`Should throw an exception with code ${StatusCode.ServerErrorInternal} from EmailValidator when was called`, async () => {
        jest.spyOn(emailValidatorStub, "isValid")
            .mockImplementationOnce(() => {
                throw new Error()
            });

        const request = makeDefaultHttpRequest();
        const response = await controller.handle(request);

        expect(response).toEqual(serverError(new ServerError()));
    });

    it(`Should return an AddAccount exception with code ${StatusCode.ServerErrorInternal} when was called`, async () => {
        jest.spyOn(addAccountStub, "add")
            .mockImplementationOnce(async () => await new Promise((resolve, reject) => reject(new Error())));

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
});
