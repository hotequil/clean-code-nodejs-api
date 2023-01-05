import { Middleware } from "../protocols/middleware";
import { HttpRequest, HttpResponse } from "../protocols";
import { AccessDeniedError } from "../errors";
import { forbidden } from "../helpers/http-helper";

export class AuthMiddleware implements Middleware{
    async handle(request: HttpRequest): Promise<HttpResponse>{
        const token = request?.headers?.["x-access-token"]

        console.log(token)

        return forbidden(new AccessDeniedError())
    }
}
