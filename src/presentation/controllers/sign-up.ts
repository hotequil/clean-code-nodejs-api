import { HttpRequest, HttpResponse } from "../protocols/http";

export class SignUpController {
    handle (request: HttpRequest): HttpResponse {
        const error: HttpResponse = { statusCode: 400, body: null };

        switch (true) {
            case !request.body.name:
                Object.assign(error, { body: new Error("Missing param: name") });
                break;
            case !request.body.email:
                Object.assign(error, { body: new Error("Missing param: email") });
                break;
        }

        return error;
    }
}
