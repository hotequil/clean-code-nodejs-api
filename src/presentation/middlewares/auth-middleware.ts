import { Middleware } from "../protocols/middleware";
import { HttpRequest, HttpResponse } from "../protocols";
import { AccessDeniedError } from "../errors";
import { forbidden, serverError, success } from "../helpers/http-helper";
import { LoadAccountByToken } from "../../domain/use-cases/load-account-by-token";
import { Header } from "../../utils/enums";

export class AuthMiddleware implements Middleware{
    constructor(private readonly loadAccountByToken: LoadAccountByToken){}

    async handle(request: HttpRequest): Promise<HttpResponse>{
        try{
            const token = request?.headers?.[Header.X_ACCESS_TOKEN]

            if(token) {
                const account = await this.loadAccountByToken.loadByToken(token)

                if(account) return success({ accountId: account.id })
            }

            return forbidden(new AccessDeniedError())
        } catch(error: any){
            return serverError(error)
        }
    }
}
