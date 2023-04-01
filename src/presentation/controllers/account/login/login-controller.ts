import { Controller, HttpResponse, Authentication, Validation } from "./login-controller-protocols";
import { badRequest, serverError, success, unauthorized } from "../../../helpers/http-helper";

export class LoginController implements Controller {
    constructor (private readonly authentication: Authentication, private readonly validation: Validation) {}

    async handle (request: LoginController.Request): Promise<HttpResponse> {
        try {
            const { password, email } = request;
            const error: Error|null = this.validation.validate({ password, email });

            if (error) return badRequest(error);

            const token = await this.authentication.auth({ email, password });

            if (!token) return unauthorized();

            return success({ token });
        } catch (error) {
            return serverError(error as Error);
        }
    }
}

export namespace LoginController {
    export type Request = {
        password: string
        email: string
    }
}
