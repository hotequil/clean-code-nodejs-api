import { AccountModel } from "../../models/account";

export type AddAccountParams = Omit<AccountModel, "id"|"accessToken">

export interface AddAccount{
    add: (account: AddAccountParams) => Promise<AccountModel | null>
}
