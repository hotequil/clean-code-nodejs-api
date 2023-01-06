import { AccountType } from "../../../utils/enums";
import { AccountModel, Decrypter, LoadAccountByToken } from "./db-load-account-by-token-protocols";

export class DbLoadAccountByToken implements LoadAccountByToken{
    constructor(private readonly decrypter: Decrypter){}

    async loadByToken(token: string, role?: AccountType): Promise<AccountModel | null> {
        console.log(token, role)

        await this.decrypter.decrypt(token)

        return null;
    }
}
