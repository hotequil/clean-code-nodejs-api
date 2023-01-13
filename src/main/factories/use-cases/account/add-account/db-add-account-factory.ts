import { AddAccount } from "@/domain/use-cases/add-account";
import { AccountMongoRepository } from "@/infra/db/mongodb/account/account-mongo-repository";
import { BcryptAdapter } from "@/infra/criptography/bcrypt/bcrypt-adapter";
import { DbAddAccount } from "@/data/use-cases/add-account/db-add-account";

export const makeDbAddAccount = (): AddAccount => {
    const SALT = 12;
    const account = new AccountMongoRepository();
    const hasher = new BcryptAdapter(SALT);

    return new DbAddAccount(hasher, account, account);
};
