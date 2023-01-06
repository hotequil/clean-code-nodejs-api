import { AuthMiddleware } from "./auth-middleware";
import StatusCode from "status-code-enum";
import { forbidden } from "../helpers/http-helper";
import { AccessDeniedError } from "../errors";
import { HttpRequest } from "../protocols";
import { Header } from "../../utils/enums";
import { LoadAccountByToken } from "../../domain/use-cases/load-account-by-token";
import { AccountModel } from "../../domain/models/account";

let middleware: AuthMiddleware;
let loadAccountByToken: LoadAccountByToken;
const FAKE_TOKEN = "token"

const makeFakeAccountModel = (): AccountModel => ({
    email: "email@test.com",
    name: "name",
    password: "password",
    id: "id",
    accessToken: "accessToken",
})

const makeFakeHttpRequest = (): HttpRequest => ({
    headers: {
        [Header.X_ACCESS_TOKEN]: FAKE_TOKEN
    }
})

class LoadAccountByTokenStub implements LoadAccountByToken{
    async loadByToken(token: string): Promise<AccountModel | null>{
        console.log(token)

        return await new Promise(resolve => resolve(makeFakeAccountModel()))
    }
}

describe(AuthMiddleware.name, () => {
    beforeEach(() => {
        loadAccountByToken = new LoadAccountByTokenStub()
        middleware = new AuthMiddleware(loadAccountByToken)
    })

    it(`Should return code ${StatusCode.ClientErrorForbidden} if has no ${Header.X_ACCESS_TOKEN} in request headers`, async () => {
        const response = await middleware.handle({})

        expect(response).toEqual(forbidden(new AccessDeniedError()))
    })

    it("Should call LoadAccountByToken with correct token", async () => {
        const loadAccountByTokenSpy = jest.spyOn(loadAccountByToken, "loadByToken")
        const request: HttpRequest = makeFakeHttpRequest()

        await middleware.handle(request)

        expect(loadAccountByTokenSpy).toHaveBeenCalledWith(FAKE_TOKEN)
    });

    it(`Should return code ${StatusCode.ClientErrorForbidden} if LoadAccountByToken returns null`, async () => {
        jest.spyOn(loadAccountByToken, "loadByToken").mockReturnValueOnce(new Promise(resolve => resolve(null)))

        const response = await middleware.handle(makeFakeHttpRequest())

        expect(response).toEqual(forbidden(new AccessDeniedError()))
    })
});
