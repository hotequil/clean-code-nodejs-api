import { SignUpController } from "@/presentation/controllers/account/sign-up/sign-up-controller";
import { type Controller } from "@/presentation/protocols";
import { makeSignUpValidationComposite } from "./sign-up-validation-factory";
import { makeDbAuthentication } from "../../../use-cases/account/authentication/db-authentication-factory";
import { makeDbAddAccount } from "../../../use-cases/account/add-account/db-add-account-factory";
import { makeLogDecorator } from "../../../decorators/log/log-decorator-factory";

export const makeSignUpController = (): Controller =>
    makeLogDecorator(new SignUpController(makeDbAddAccount(), makeSignUpValidationComposite(), makeDbAuthentication()));
