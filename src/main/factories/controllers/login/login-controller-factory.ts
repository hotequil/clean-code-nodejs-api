import { Controller } from "../../../../presentation/protocols";
import { LoginController } from "../../../../presentation/controllers/login/login/login-controller";
import { makeLoginValidationComposite } from "./login-validation-factory";
import { makeDbAuthentication } from "../../use-cases/authentication/db-authentication-factory";
import { makeLogDecorator } from "../../use-cases/decorators/log-decorator-factory";

export const makeLoginController = (): Controller =>
    makeLogDecorator(new LoginController(makeDbAuthentication(), makeLoginValidationComposite()))
