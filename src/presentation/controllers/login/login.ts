import { Controller, HttpRequest, HttpResponse, Authentication, Validation } from "./login-protocols";
import { badRequest, serverError, success, unauthorized } from "../../helpers/http-helper";

export class LoginController implements Controller {
    constructor (private readonly authentication: Authentication, private readonly validation: Validation) {}

    async handle (request: HttpRequest): Promise<HttpResponse> {
        try {
            const { password, email } = request.body;
            const error: Error|null = this.validation.validate({ password, email });

            // if (!email) error = new MissingParamsError("email");
            // else if (!password) error = new MissingParamsError("password");
            // else if (!this.emailValidator.isValid(email)) error = new InvalidParamsError("email");

            if (error) return badRequest(error);

            const token = await this.authentication.auth({ email, password });

            if (!token) return unauthorized();

            return success({ token });
        } catch (error) {
            return serverError(error as Error);
        }
    }
}
