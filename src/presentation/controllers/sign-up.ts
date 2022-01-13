import { StatusCode } from "status-code-enum";

import { HttpRequest, HttpResponse } from "../protocols/http";
import { MissingParamsError } from "../errors/missing-params/missing-params-error";
import { badRequest } from "../helpers/http-helper";
import { Controller } from "../protocols/controller";
import { EmailValidator } from "../protocols/email-validator";
import { InvalidParamsError } from "../errors/invalid-params/invalid-params-error";
import { ServerError } from "../errors/server/server-error";

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

            if (!this.emailValidator.isValid(body.email))
                return badRequest(new InvalidParamsError("email"));

            return { statusCode: StatusCode.SuccessOK, body: null };
        } catch (error) {
            console.log(error);

            return {
                statusCode: StatusCode.ServerErrorInternal,
                body: new ServerError()
            }
        }
    }
}
