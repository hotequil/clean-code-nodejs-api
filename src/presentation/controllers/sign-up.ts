import { StatusCode } from "status-code-enum";

import { HttpRequest, HttpResponse } from "../protocols/http";
import { MissingParamsError } from "../errors/missing-params-error";
import { badRequest } from "../helpers/http-helper";

export class SignUpController {
    handle ({ body }: HttpRequest): HttpResponse {
        let error: HttpResponse = { statusCode: StatusCode.SuccessOK, body: null };

        switch (true) {
            case !body.name:
                error = badRequest(new MissingParamsError("name"));
                break;
            case !body.email:
                error = badRequest(new MissingParamsError("email"));
                break;
        }

        return error;
    }
}
