import { AccountType } from "../../../utils/enums";
import {
    AccountModel,
    Decrypter,
    LoadAccountByToken,
    LoadAccountByTokenRepository
} from "./db-load-account-by-token-protocols";

export class DbLoadAccountByToken implements LoadAccountByToken{
    constructor(
        private readonly decrypter: Decrypter,
        private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository,
    ){}

    async loadByToken(token: string, role?: AccountType): Promise<AccountModel | null> {
        let account: AccountModel | null = null
        const decryptedToken = await this.decrypter.decrypt(token)

        if(decryptedToken) account = await this.loadAccountByTokenRepository.loadByToken(decryptedToken, role)

        return account;
    }
}
