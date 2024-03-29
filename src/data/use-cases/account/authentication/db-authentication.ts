import {
    type Authentication,
    type LoadAccountByEmailRepository,
    type UpdateAccessTokenRepository,
    type Encrypter,
    type HashComparer
} from "./db-authentication-protocols";

export class DbAuthentication implements Authentication {
    constructor (
        private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
        private readonly hashComparer: HashComparer,
        private readonly encrypter: Encrypter,
        private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
    ) {}

    async auth (model: Authentication.Params): Promise<Authentication.Result> {
        const account = await this.loadAccountByEmailRepository.loadByEmail(model.email);

        if (!account) return null;

        const valid = await this.hashComparer.compare(model.password, account.password);

        if (!valid) return null;

        const { id, name } = account;
        const token = await this.encrypter.encrypt(id);

        if (!token || !name) return null;

        await this.updateAccessTokenRepository.updateAccessToken(id, token);

        return { token, name };
    }
}
