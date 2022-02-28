import { Authentication, AuthenticationModel } from "../../../domain/use-cases/authentication";
import { LoadAccountByEmailRepository } from "../../protocols/db/load-account-by-email-repository";
import { HashComparer } from "../../protocols/criptography/hash-comparer";

export class DbAuthentication implements Authentication {
    constructor (
        private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
        private readonly hashComparer: HashComparer
    ) {}

    async auth (model: AuthenticationModel): Promise<string|null> {
        const account = await this.loadAccountByEmailRepository.load(model.email);

        if (!account) return null;

        await this.hashComparer.compare(account.password, model.password);

        return null;
    }
}
