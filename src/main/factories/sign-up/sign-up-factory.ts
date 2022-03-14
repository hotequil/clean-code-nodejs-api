import { SignUpController } from "../../../presentation/controllers/sign-up/sign-up";
import { DbAddAccount } from "../../../data/use-cases/add-account/db-add-account";
import { AccountMongoRepository } from "../../../infra/db/mongodb/account-repository/account-mongo-repository";
import { BcryptAdapter } from "../../../infra/criptography/bcrypt/bcrypt-adapter";
import { LogDecorator } from "../../decorators/log/log-controller-decorator";
import { Controller } from "../../../presentation/protocols";
import { LogMongoRepository } from "../../../infra/db/mongodb/log-repository/log-mongo-repository"
import { makeSignUpValidationComposite } from "./sign-up-validation-factory";

export const makeSignUpController = (): Controller => {
    const SALT = 12;
    const account = new AccountMongoRepository();
    const hasher = new BcryptAdapter(SALT);
    const dbAddAccount = new DbAddAccount(hasher, account);
    const validationComposite = makeSignUpValidationComposite();
    const signUpController = new SignUpController(dbAddAccount, validationComposite);
    const logMongoRepository = new LogMongoRepository();

    return new LogDecorator(signUpController, logMongoRepository);
};
