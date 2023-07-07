import { AccountType } from "@/utils/enums";

export interface LoadAccountByToken{
    loadByToken: (token: string, role?: AccountType) => Promise<LoadAccountByToken.Result>
}

export namespace LoadAccountByToken{
    export type Result = { id: string } | null
}
