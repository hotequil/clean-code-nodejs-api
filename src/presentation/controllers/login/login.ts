import { Controller, HttpRequest, HttpResponse } from "../../protocols";
import { badRequest } from "../../helpers/http-helper";
import { MissingParamsError } from "../../errors";

export class LoginController implements Controller {
    async handle (request: HttpRequest): Promise<HttpResponse> {
        return await new Promise(resolve => {
            const { password, email } = request.body;
            let error: MissingParamsError|null = null;

            if (!email) error = new MissingParamsError("email");
            else if (!password) error = new MissingParamsError("password");

            if (error) resolve(badRequest(error));
        });
    }
}
