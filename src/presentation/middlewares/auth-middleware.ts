import { AccessDeniedError } from "../errors";
import { forbidden, serverError, success } from "../helpers/http-helper";
import { type AccountType, Header } from "@/utils/enums";
import { type HttpResponse, type LoadAccountByToken, type Middleware } from "./auth-middleware-protocols";

export class AuthMiddleware implements Middleware {
    constructor(private readonly loadAccountByToken: LoadAccountByToken, private readonly role?: AccountType) {}

    async handle(request: AuthMiddleware.Request): Promise<HttpResponse> {
        try{
            const token = request[Header.X_ACCESS_TOKEN]

            if(token) {
                const account = await this.loadAccountByToken.loadByToken(token, this.role)

                if(account) return success({ accountId: account.id })
            }

            return forbidden(new AccessDeniedError())
        } catch(error: any) {
            return serverError(error)
        }
    }
}

export namespace AuthMiddleware{
    export type Request = {
        [Header.X_ACCESS_TOKEN]: string
    }
}
