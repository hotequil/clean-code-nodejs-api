import { AccessDeniedError } from "../errors";
import { forbidden, serverError, success } from "../helpers/http-helper";
import { AccountType, Header } from "../../utils/enums";
import { HttpRequest, HttpResponse, LoadAccountByToken, Middleware } from "./auth-middleware-protocols";

export class AuthMiddleware implements Middleware{
    constructor(private readonly loadAccountByToken: LoadAccountByToken, private readonly role?: AccountType){}

    async handle(request: HttpRequest): Promise<HttpResponse>{
        try{
            const token = request?.headers?.[Header.X_ACCESS_TOKEN]

            if(token) {
                const account = await this.loadAccountByToken.loadByToken(token, this.role)

                if(account) return success({ accountId: account.id })
            }

            return forbidden(new AccessDeniedError())
        } catch(error: any){
            return serverError(error)
        }
    }
}
