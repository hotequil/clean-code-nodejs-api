import { AccountType } from "@/utils/enums";
import {
    Decrypter,
    LoadAccountByToken,
    LoadAccountByTokenRepository
} from "./db-load-account-by-token-protocols";

export class DbLoadAccountByToken implements LoadAccountByToken{
    constructor(
        private readonly decrypter: Decrypter,
        private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository,
    ){}

    async loadByToken(token: string, role?: AccountType): Promise<LoadAccountByToken.Result> {
        let decryptedToken: string | null = null

        try {
            decryptedToken = await this.decrypter.decrypt(token)
        } catch(error){
            console.error(error)

            return null
        }

        if(!decryptedToken) return null

        return await this.loadAccountByTokenRepository.loadByToken(token, role);
    }
}
