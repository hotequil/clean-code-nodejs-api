import { Middleware } from "../protocols/middleware";
import { HttpRequest, HttpResponse } from "../protocols";
import { AccessDeniedError } from "../errors";
import { forbidden } from "../helpers/http-helper";
import { LoadAccountByToken } from "../../domain/use-cases/load-account-by-token";
import { Header } from "../../utils/enums";

export class AuthMiddleware implements Middleware{
    constructor(private readonly loadAccountByToken: LoadAccountByToken){}

    async handle(request: HttpRequest): Promise<HttpResponse>{
        const token = request?.headers?.[Header.X_ACCESS_TOKEN]

        if(token) await this.loadAccountByToken.loadByToken(token)

        return forbidden(new AccessDeniedError())
    }
}
