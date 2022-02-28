import { Authentication, AuthenticationModel } from "../../../domain/use-cases/authentication";
import { LoadAccountByEmailRepository } from "../../protocols/db/load-account-by-email-repository";
import { HashComparer } from "../../protocols/criptography/hash-comparer";
import { TokenGenerator } from "../../protocols/criptography/token-generator";

export class DbAuthentication implements Authentication {
    constructor (
        private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
        private readonly hashComparer: HashComparer,
        private readonly tokenGenerator: TokenGenerator
    ) {}

    async auth (model: AuthenticationModel): Promise<string|null> {
        const account = await this.loadAccountByEmailRepository.load(model.email);

        if (!account) return null;

        const valid = await this.hashComparer.compare(account.password, model.password);

        if (!valid) return null;

        const token = await this.tokenGenerator.generate(account.id);

        if (!token) return null;

        return token;
    }
}
