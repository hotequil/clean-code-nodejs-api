import { HttpRequest, HttpResponse } from "../protocols/http";
import { MissingParamsError } from "../errors/missing-params-error";

export class SignUpController {
    handle ({ body }: HttpRequest): HttpResponse {
        const error: HttpResponse = { statusCode: 400, body: null };

        switch (true) {
            case !body.name:
                Object.assign(error, { body: new MissingParamsError("name") });
                break;
            case !body.email:
                Object.assign(error, { body: new MissingParamsError("email") });
                break;
        }

        return error;
    }
}
