import { Authentication, AuthenticationModel } from "../../../domain/use-cases/authentication";
import { LoadAccountByEmailRepository } from "../../protocols/db/load-account-by-email-repository";
import { HashComparer } from "../../protocols/criptography/hash-comparer";
import { TokenGenerator } from "../../protocols/criptography/token-generator";
import { UpdateAccessTokenRepository } from "../../protocols/db/update-access-token-repository";

export class DbAuthentication implements Authentication {
    constructor (
        private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
        private readonly hashComparer: HashComparer,
        private readonly tokenGenerator: TokenGenerator,
        private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
    ) {}

    async auth (model: AuthenticationModel): Promise<string|null> {
        const account = await this.loadAccountByEmailRepository.load(model.email);

        if (!account) return null;

        const valid = await this.hashComparer.compare(account.password, model.password);

        if (!valid) return null;

        const { id } = account;
        const token = await this.tokenGenerator.generate(id);

        if (!token) return null;

        await this.updateAccessTokenRepository.update(id, token);

        return token;
    }
}
