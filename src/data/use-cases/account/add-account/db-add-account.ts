import {
    AddAccount,
    AddAccountRepository,
    Hasher,
    LoadAccountByEmailRepository
} from "./db-add-account-protocols";

export class DbAddAccount implements AddAccount {
    constructor (
        private readonly hasher: Hasher,
        private readonly addAccountRepository: AddAccountRepository,
        private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
    ) {}

    async add (account: AddAccountRepository.Params): Promise<AddAccountRepository.Result> {
        const accountByEmail = await this.loadAccountByEmailRepository.loadByEmail(account.email);
        let result = false

        if (!accountByEmail) {
            const password = await this.hasher.hash(account.password);

            result = await this.addAccountRepository.add({ ...account, password });
        }

        return result;
    }
}
