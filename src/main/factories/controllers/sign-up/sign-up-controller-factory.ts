import { SignUpController } from "../../../../presentation/controllers/authentication/sign-up/sign-up-controller";
import { Controller } from "../../../../presentation/protocols";
import { makeSignUpValidationComposite } from "./sign-up-validation-factory";
import { makeDbAuthentication } from "../../use-cases/authentication/db-authentication-factory";
import { makeDbAddAccount } from "../../use-cases/add-account/db-add-account-factory";
import { makeLogDecorator } from "../../use-cases/decorators/log-decorator-factory";

export const makeSignUpController = (): Controller =>
    makeLogDecorator(new SignUpController(makeDbAddAccount(), makeSignUpValidationComposite(), makeDbAuthentication()));
