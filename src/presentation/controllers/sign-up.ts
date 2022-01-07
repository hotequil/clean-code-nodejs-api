import { StatusCode } from "status-code-enum";

import { HttpRequest, HttpResponse } from "../protocols/http";
import { MissingParamsError } from "../errors/missing-params-error";
import { badRequest } from "../helpers/http-helper";

export class SignUpController {
    handle ({ body }: HttpRequest): HttpResponse {
        const requiredFields = ["name", "email", "password"];

        for (const field of requiredFields) {
            if (!body[field]) return badRequest(new MissingParamsError(field));
        }

        return { statusCode: StatusCode.SuccessOK, body: null };
    }
}
