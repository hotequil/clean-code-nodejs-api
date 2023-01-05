import { AuthMiddleware } from "./auth-middleware";
import StatusCode from "status-code-enum";
import { forbidden } from "../helpers/http-helper";
import { AccessDeniedError } from "../errors";

let middleware: AuthMiddleware;

describe(AuthMiddleware.name, () => {
    beforeEach(() => middleware = new AuthMiddleware())

    it(`Should return code ${StatusCode.ClientErrorForbidden} if has no x-access-token in request headers`, async () => {
        const response = await middleware.handle({})

        expect(response).toEqual(forbidden(new AccessDeniedError()))
    })
});
