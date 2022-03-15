import { Controller } from "../../../presentation/protocols";
import { LoginController } from "../../../presentation/controllers/login/login-controller";
import { LogDecorator } from "../../decorators/log/log-controller-decorator";
import { LogMongoRepository } from "../../../infra/db/mongodb/log-repository/log-mongo-repository";
import { DbAuthentication } from "../../../data/use-cases/authentication/db-authentication";
import { makeLoginValidationComposite } from "./login-validation-factory";
import { AccountMongoRepository } from "../../../infra/db/mongodb/account-repository/account-mongo-repository";
import { BcryptAdapter } from "../../../infra/criptography/bcrypt/bcrypt-adapter";
import { JwtAdapter } from "../../../infra/criptography/jwt/jwt-adapter";
import env from "../../config/env";

export const makeLoginController = (): Controller => {
    const SALT = 12;
    const bcryptAdapter = new BcryptAdapter(SALT);
    const jwtAdapter = new JwtAdapter(env.JWT_SECRET);
    const accountMongoRepository = new AccountMongoRepository();
    const dbAuthentication = new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository);
    const validationComposite = makeLoginValidationComposite();
    const loginController = new LoginController(dbAuthentication, validationComposite);
    const logMongoRepository = new LogMongoRepository();

    return new LogDecorator(loginController, logMongoRepository);
};
