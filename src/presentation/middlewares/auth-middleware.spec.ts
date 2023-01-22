import { AuthMiddleware } from "./auth-middleware";
import StatusCode from "status-code-enum";
import { forbidden, serverError, success } from "../helpers/http-helper";
import { AccessDeniedError } from "../errors";
import { AccountType, Header } from "@/utils/enums";
import { HttpRequest, LoadAccountByToken } from "./auth-middleware-protocols";
import { mockAccountModel, mockLoadAccountByTokenRepository, throwError } from "@/utils/tests";

let middleware: AuthMiddleware;
let loadAccountByToken: LoadAccountByToken;
const FAKE_TOKEN = "token"

const mockHttpRequest = (): HttpRequest => ({
    headers: {
        [Header.X_ACCESS_TOKEN]: FAKE_TOKEN
    }
})

describe(AuthMiddleware.name, () => {
    beforeEach(() => {
        loadAccountByToken = mockLoadAccountByTokenRepository()
        middleware = new AuthMiddleware(loadAccountByToken)
    })

    it(`Should return code ${StatusCode.ClientErrorForbidden} if has no ${Header.X_ACCESS_TOKEN} in request headers`, async () => {
        const response = await middleware.handle({})

        expect(response).toEqual(forbidden(new AccessDeniedError()))
    })

    it("Should call LoadAccountByToken with correct token", async () => {
        const role = AccountType.USER

        loadAccountByToken = mockLoadAccountByTokenRepository()
        middleware = new AuthMiddleware(loadAccountByToken, role)

        const loadAccountByTokenSpy = jest.spyOn(loadAccountByToken, "loadByToken")
        const request: HttpRequest = mockHttpRequest()

        await middleware.handle(request)

        expect(loadAccountByTokenSpy).toHaveBeenCalledWith(FAKE_TOKEN, role)
    });

    it(`Should return code ${StatusCode.ClientErrorForbidden} if LoadAccountByToken returns null`, async () => {
        jest.spyOn(loadAccountByToken, "loadByToken").mockReturnValueOnce(Promise.resolve(null))

        const response = await middleware.handle(mockHttpRequest())

        expect(response).toEqual(forbidden(new AccessDeniedError()))
    })

    it(`Should return code ${StatusCode.SuccessOK} if LoadAccountByToken returns an account`, async () => {
        const account = mockAccountModel()
        const response = await middleware.handle(mockHttpRequest())

        expect(response).toEqual(success({ accountId: account.id }))
    })

    it(`Should return code ${StatusCode.ServerErrorInternal} if LoadAccountByToken throws`, async () => {
        jest.spyOn(loadAccountByToken, "loadByToken").mockImplementationOnce(throwError)

        const response = await middleware.handle(mockHttpRequest())

        expect(response).toEqual(serverError(new Error()))
    });
});
