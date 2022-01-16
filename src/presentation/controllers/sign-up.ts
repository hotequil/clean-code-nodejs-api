import { HttpRequest, HttpResponse, Controller, EmailValidator } from "../protocols";
import { MissingParamsError, InvalidParamsError } from "../errors";
import { badRequest, serverError, success } from "../helpers/http-helper";
import { AddAccount } from "../../domain/use-cases/add-account";

export class SignUpController implements Controller {
    private readonly emailValidator: EmailValidator;
    private readonly addAccount: AddAccount;

    constructor (emailValidator: EmailValidator, addAccount: AddAccount) {
        this.emailValidator = emailValidator;
        this.addAccount = addAccount;
    }

    handle ({ body }: HttpRequest): HttpResponse {
        try {
            const requiredFields = ["name", "email", "password", "passwordConfirmation"];

            for (const field of requiredFields) {
                if (!body[field]) return badRequest(new MissingParamsError(field));
            }

            const { name, email, password, passwordConfirmation } = body;

            if (password !== passwordConfirmation)
                return badRequest(new InvalidParamsError("passwordConfirmation"));

            if (!this.emailValidator.isValid(email))
                return badRequest(new InvalidParamsError("email"));

            return success(this.addAccount.add({ name, email, password }));
        } catch (error) {
            console.log(error);

            return serverError();
        }
    }
}
