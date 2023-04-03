import { AccountModel } from "@/domain/models/account";
import { AddAccount } from "@/domain/use-cases/account/add-account";
import { AddAccountRepository } from "@/data/protocols/db/account/add-account-repository";
import { LoadAccountByEmailRepository } from "@/data/protocols/db/account/load-account-by-email-repository";
import { LoadAccountByTokenRepository } from "@/data/protocols/db/account/load-account-by-token-repository";
import { AccountType } from "@/utils/enums";
import { UpdateAccessTokenRepository } from "@/data/protocols/db/account/update-access-token-repository";
import { Authentication } from "@/domain/use-cases/account/authentication";
import { CheckAccountByEmailRepository } from "@/data/protocols/db/account/check-account-by-email-repository";

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

export const mockAuthenticationParams = (email: string, password: string): Authentication.Params => ({
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
        async loadByEmail (email: string): Promise<LoadAccountByEmailRepository.Result> {
            console.log(email)

            return account ?? null;
        }
    }

    return new LoadAccountByEmailRepositoryStub()
}

export const mockCheckAccountByEmailRepository = (): CheckAccountByEmailRepository => {
    class CheckAccountByEmailRepositoryStub implements CheckAccountByEmailRepository {
        async checkByEmail (email: string): Promise<CheckAccountByEmailRepository.Result> {
            console.log(email)

            return false;
        }
    }

    return new CheckAccountByEmailRepositoryStub()
}

export const mockLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
    class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository{
        async loadByToken(token: string, role?: AccountType): Promise<LoadAccountByTokenRepository.Result>{
            console.log(token, role)

            const { id } = mockAccountModel()

            return { id }
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
