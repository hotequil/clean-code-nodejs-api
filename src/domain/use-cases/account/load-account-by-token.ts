import { AccountType } from "@/utils/enums";
import { AccountModel } from "../../models/account";

export interface LoadAccountByToken{
    loadByToken: (token: string, role?: AccountType) => Promise<AccountModel | null>
}
