import { Controller, HttpRequest, HttpResponse } from "../../protocols";
import { badRequest, serverError, success, unauthorized } from "../../helpers/http-helper";
import { InvalidParamsError, MissingParamsError } from "../../errors";
import { EmailValidator } from "../../protocols/email-validator";
import { Authentication } from "../../../domain/use-cases/authentication";

export class LoginController implements Controller {
    constructor (private readonly emailValidator: EmailValidator, private readonly authentication: Authentication) {}

    async handle (request: HttpRequest): Promise<HttpResponse> {
        try {
            const { password, email } = request.body;
            let error: MissingParamsError|null = null;

            if (!email) error = new MissingParamsError("email");
            else if (!password) error = new MissingParamsError("password");
            else if (!this.emailValidator.isValid(email)) error = new InvalidParamsError("email");

            if (error) return badRequest(error);

            const token = await this.authentication.auth(email, password);

            if (!token) return unauthorized();

            return success(token);
        } catch (error) {
            return serverError(error as Error);
        }
    }
}
