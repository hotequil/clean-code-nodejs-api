import {
    AddAccount,
    AddAccountRepository,
    Hasher,
    CheckAccountByEmailRepository,
} from "./db-add-account-protocols";

export class DbAddAccount implements AddAccount {
    constructor (
        private readonly hasher: Hasher,
        private readonly addAccountRepository: AddAccountRepository,
        private readonly checkAccountByEmailRepository: CheckAccountByEmailRepository
    ) {}

    async add (account: AddAccountRepository.Params): Promise<AddAccountRepository.Result> {
        const exists = await this.checkAccountByEmailRepository.checkByEmail(account.email);
        let result = false

        if (!exists) {
            const password = await this.hasher.hash(account.password);

            result = await this.addAccountRepository.add({ ...account, password });
        }

        return result;
    }
}
