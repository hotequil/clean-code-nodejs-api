import { Controller, HttpRequest, HttpResponse } from "../../protocols";
import { badRequest, success } from "../../helpers/http-helper";
import { InvalidParamsError, MissingParamsError } from "../../errors";
import { EmailValidator } from "../../protocols/email-validator";

export class LoginController implements Controller {
    constructor (private readonly emailValidator: EmailValidator) {}

    async handle (request: HttpRequest): Promise<HttpResponse> {
        return await new Promise(resolve => {
            const { password, email } = request.body;
            let error: MissingParamsError|null = null;

            if (!email) error = new MissingParamsError("email");
            else if (!password) error = new MissingParamsError("password");
            else if (!this.emailValidator.isValid(email)) error = new InvalidParamsError("email");

            if (error) resolve(badRequest(error));
            else resolve(success(null));
        });
    }
}
