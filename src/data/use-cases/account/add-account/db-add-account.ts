import {
    AccountModel,
    AddAccount,
    AddAccountModel,
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

    async add (account: AddAccountModel): Promise<AccountModel | null> {
        const accountByEmail = await this.loadAccountByEmailRepository.loadByEmail(account.email);

        if (!accountByEmail) {
            const password = await this.hasher.hash(account.password);
            const fakeAccount = await this.addAccountRepository.add({ ...account, password });

            return await new Promise(resolve => resolve({ ...account, ...fakeAccount }));
        }

        return null;
    }
}
