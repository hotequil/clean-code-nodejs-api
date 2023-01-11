import { adaptMiddleware } from "../../adapters/express-middleware-adapter";
import { makeAuthMiddleware } from "../../factories/middlewares/auth-middleware-factory";
import { AccountType } from "../../../utils/enums";

export const defaultAuth = adaptMiddleware(makeAuthMiddleware())
export const adminAuth = adaptMiddleware(makeAuthMiddleware(AccountType.ADMIN))
