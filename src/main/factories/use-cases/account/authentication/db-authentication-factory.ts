import { DbAuthentication } from "@/data/use-cases/account/authentication/db-authentication";
import { AccountMongoRepository } from "@/infra/db/mongodb/account/account-mongo-repository";
import env from "../../../../config/env";
import { JwtAdapter } from "@/infra/criptography/jwt/jwt-adapter";
import { BcryptAdapter } from "@/infra/criptography/bcrypt/bcrypt-adapter";
import { type Authentication } from "@/domain/use-cases/account/authentication";

export const makeDbAuthentication = (): Authentication => {
    const SALT = 12;
    const bcryptAdapter = new BcryptAdapter(SALT);
    const jwtAdapter = new JwtAdapter(env.JWT_SECRET);
    const accountMongoRepository = new AccountMongoRepository();

    return new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository);
};
