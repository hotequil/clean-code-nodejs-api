import { AccountModel } from "../../models/account";

export interface AddAccount{
    add: (account: AddAccount.Params) => Promise<AddAccount.Result>
}

export namespace AddAccount{
    export type Params = Omit<AccountModel, "id" | "accessToken">
    export type Result = boolean
}
