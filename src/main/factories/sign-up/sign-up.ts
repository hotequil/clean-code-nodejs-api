import { SignUpController } from "../../presentation/controllers/sign-up/sign-up";
import { EmailValidatorAdapter } from "../../utils/adapters/email-validator/email-validator-adapter";
import { DbAddAccount } from "../../data/use-cases/add-account/db-add-account";
import { Account } from "../../infra/db/mongodb/account-repository/account";
import { BcryptAdapter } from "../../infra/criptography/bcrypt-adapter";
import { LogDecorator } from "../decorators/log/log";
import { Controller } from "../../presentation/protocols";
import { LogMongoRepository } from "../../infra/db/mongodb/log-repository/log";
import { makeSignUpValidationComposite } from "./sign-up-validation-composite";

export const makeSignUpController = (): Controller => {
    const SALT = 12;
    const emailValidator = new EmailValidatorAdapter();
    const account = new Account();
    const encrypter = new BcryptAdapter(SALT);
    const dbAddAccount = new DbAddAccount(encrypter, account);
    const validationComposite = makeSignUpValidationComposite();
    const signUpController = new SignUpController(emailValidator, dbAddAccount, validationComposite);
    const logMongoRepository = new LogMongoRepository();

    return new LogDecorator(signUpController, logMongoRepository);
};
