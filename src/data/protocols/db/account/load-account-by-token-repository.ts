import { AccountModel } from "../../../../domain/models/account";
import { AccountType } from "../../../../utils/enums";

export interface LoadAccountByTokenRepository {
    loadByToken: (token: string, role?: AccountType) => Promise<AccountModel | null>
}
