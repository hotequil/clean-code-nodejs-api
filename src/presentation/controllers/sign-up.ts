import { HttpRequest, HttpResponse, Controller, EmailValidator } from "../protocols";
import { MissingParamsError, InvalidParamsError } from "../errors";
import { badRequest, serverError, success } from "../helpers/http-helper";

export class SignUpController implements Controller {
    private readonly emailValidator: EmailValidator;

    constructor (emailValidator: EmailValidator) {
        this.emailValidator = emailValidator;
    }

    handle ({ body }: HttpRequest): HttpResponse {
        try {
            const requiredFields = ["name", "email", "password", "passwordConfirmation"];

            for (const field of requiredFields) {
                if (!body[field]) return badRequest(new MissingParamsError(field));
            }

            const { email, password, passwordConfirmation } = body;

            if (password !== passwordConfirmation)
                return badRequest(new InvalidParamsError("passwordConfirmation"));

            if (!this.emailValidator.isValid(email))
                return badRequest(new InvalidParamsError("email"));

            return success(null);
        } catch (error) {
            console.log(error);

            return serverError();
        }
    }
}
