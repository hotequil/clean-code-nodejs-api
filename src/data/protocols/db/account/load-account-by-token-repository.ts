import { type AccountType } from "@/utils/enums";
import { type LoadAccountByToken } from "@/domain/use-cases/account/load-account-by-token";

export interface LoadAccountByTokenRepository {
    loadByToken: (token: string, role?: AccountType) => Promise<LoadAccountByTokenRepository.Result>
}

export namespace LoadAccountByTokenRepository{
    export type Result = LoadAccountByToken.Result
}
