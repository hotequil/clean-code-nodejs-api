import { AccountModel } from "@/domain/models/account";
import { AddAccount } from "@/domain/use-cases/account/add-account";
import { AddAccountRepository } from "@/data/protocols/db/account/add-account-repository";
import { LoadAccountByEmailRepository } from "@/data/protocols/db/account/load-account-by-email-repository";
import { LoadAccountByTokenRepository } from "@/data/protocols/db/account/load-account-by-token-repository";
import { AccountType } from "@/utils/enums";
import { UpdateAccessTokenRepository } from "@/data/protocols/db/account/update-access-token-repository";
import { AuthenticationParams } from "@/domain/use-cases/account/authentication";

export const mockAccountModel = (): AccountModel => ({
    id: "id",
    name: "name",
    email: "email@test.com",
    password: "password",
    accessToken: "accessToken",
})

export const mockAddAccountParams = (password = "password"): AddAccount.Params => ({
    name: "name",
    email: "email@email.email",
    password,
})

export const mockAuthenticationParams = (email: string, password: string): AuthenticationParams => ({
    email,
    password,
});

export const mockAddAccountRepository = (id: string, password: string): AddAccountRepository => {
    class AddAccountRepositoryStub implements AddAccountRepository {
        async add (account: AddAccountRepository.Params): Promise<AddAccountRepository.Result> {
            return !!{ ...account, password, id };
        }
    }

    return new AddAccountRepositoryStub()
}

export const mockLoadAccountByEmailRepository = (
    account?: { id: string, name: string, password: string }
): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
        async loadByEmail (email: string): Promise<AccountModel | null> {
            return account ? { ...account, email } : null;
        }
    }

    return new LoadAccountByEmailRepositoryStub()
}

export const mockLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
    class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository{
        async loadByToken(token: string, role?: AccountType): Promise<AccountModel | null>{
            console.log(token, role)

            return mockAccountModel()
        }
    }

    return new LoadAccountByTokenRepositoryStub()
}

export const mockUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
    class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
        async updateAccessToken (id: string, token: string): Promise<void> {
            console.log(id, token);

            await Promise.resolve()
        }
    }

    return new UpdateAccessTokenRepositoryStub()
}

export const mockAddAccount = (): AddAccount => {
    class AddAccountStub implements AddAccount {
        async add (account: AddAccount.Params): Promise<AddAccount.Result> {
            return !!{ ...account, id: "id" };
        }
    }

    return new AddAccountStub()
}
