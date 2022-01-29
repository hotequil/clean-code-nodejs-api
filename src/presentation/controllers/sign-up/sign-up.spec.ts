import { StatusCode } from "status-code-enum";

import { SignUpController } from "./sign-up";
import { HttpRequest, EmailValidator, AccountModel, AddAccount, AddAccountModel } from "./sign-up-protocols";
import { InvalidParamsError, ServerError, MissingParamsError } from "../../errors";

let controller: SignUpController;
let emailValidatorStub: EmailValidator;
let addAccountStub: AddAccount;

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

describe("SignUpController", () => {
    beforeEach(() => {
        emailValidatorStub = new EmailValidatorStub();
        addAccountStub = new AddAccountStub();
        controller = new SignUpController(emailValidatorStub, addAccountStub);
    });

    it(`Should return code ${StatusCode.ClientErrorBadRequest} when name is not provided`, async () => {
        const request: HttpRequest = {
            body: {
                email: "email@email.email",
                password: "passwordAndConfirmation",
                passwordConfirmation: "passwordAndConfirmation"
            }
        };

        const { body, statusCode } = await controller.handle(request);

        expect(statusCode).toBe(StatusCode.ClientErrorBadRequest);
        expect(body).toEqual(new MissingParamsError("name"));
    });

    it(`Should return code ${StatusCode.ClientErrorBadRequest} when email is not provided`, async () => {
        const request: HttpRequest = {
            body: {
                name: "name",
                password: "passwordAndConfirmation",
                passwordConfirmation: "passwordAndConfirmation"
            }
        };

        const { statusCode, body } = await controller.handle(request);

        expect(statusCode).toBe(StatusCode.ClientErrorBadRequest);
        expect(body).toEqual(new MissingParamsError("email"));
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

        const { statusCode, body } = await controller.handle(request);

        expect(statusCode).toBe(StatusCode.ClientErrorBadRequest);
        expect(body).toEqual(new MissingParamsError("password"));
    });

    it(`Should return code ${StatusCode.ClientErrorBadRequest} when passwordConfirmation was not provided`, async () => {
        const request: HttpRequest = {
            body: {
                name: "name",
                email: "email@email.email",
                password: "passwordAndConfirmation"
            }
        };

        const { statusCode, body } = await controller.handle(request);

        expect(statusCode).toBe(StatusCode.ClientErrorBadRequest);
        expect(body).toEqual(new MissingParamsError("passwordConfirmation"));
    });

    it(`Should return code ${StatusCode.ClientErrorBadRequest} when email is not valid`, async () => {
        jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);

        const request: HttpRequest = makeDefaultHttpRequest();
        const { statusCode, body } = await controller.handle(request);

        expect(statusCode).toBe(StatusCode.ClientErrorBadRequest);
        expect(body).toEqual(new InvalidParamsError("email"));
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

        const { statusCode, body } = await controller.handle(request);

        expect(statusCode).toBe(StatusCode.ClientErrorBadRequest);
        expect(body).toEqual(new InvalidParamsError("passwordConfirmation"));
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
        const { body, statusCode } = await controller.handle(request);

        expect(statusCode).toBe(StatusCode.ServerErrorInternal);
        expect(body).toEqual(new ServerError());
    });

    it(`Should return an AddAccount exception with code ${StatusCode.ServerErrorInternal} when was called`, async () => {
        jest.spyOn(addAccountStub, "add")
            .mockImplementationOnce(async () => await new Promise((resolve, reject) => reject(new Error())));

        const request = makeDefaultHttpRequest();
        const { statusCode, body } = await controller.handle(request);

        expect(statusCode).toBe(StatusCode.ServerErrorInternal);
        expect(body).toEqual(new ServerError());
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
});
