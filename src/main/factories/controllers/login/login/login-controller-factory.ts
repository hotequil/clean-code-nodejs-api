import { Controller } from "@/presentation/protocols";
import { LoginController } from "@/presentation/controllers/login/login/login-controller";
import { makeLoginValidationComposite } from "./login-validation-factory";
import { makeDbAuthentication } from "../../../use-cases/account/authentication/db-authentication-factory";
import { makeLogDecorator } from "../../../decorators/log/log-decorator-factory";

export const makeLoginController = (): Controller =>
    makeLogDecorator(new LoginController(makeDbAuthentication(), makeLoginValidationComposite()))
