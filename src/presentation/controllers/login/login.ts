import { Controller, HttpRequest, HttpResponse } from "../../protocols";
import { badRequest } from "../../helpers/http-helper";
import { MissingParamsError } from "../../errors";

export class LoginController implements Controller {
    async handle (request: HttpRequest): Promise<HttpResponse> {
        console.log(request);

        return await new Promise(resolve => resolve(badRequest(new MissingParamsError("email"))));
    }
}
