import { Middleware } from "../../../presentation/protocols/middleware";
import { AuthMiddleware } from "../../../presentation/middlewares/auth-middleware";
import { makeDbLoadAccountByToken } from "../use-cases/account/load-account-by-token/db-load-account-by-token-factory";
import { AccountType } from "../../../utils/enums";

export const makeAuthMiddleware = (role?: AccountType): Middleware =>
    new AuthMiddleware(makeDbLoadAccountByToken(), role)
