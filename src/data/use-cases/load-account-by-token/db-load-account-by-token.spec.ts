import { DbLoadAccountByToken } from "./db-load-account-by-token";
import { Decrypter } from "./db-load-account-by-token-protocols";
import { AccountType } from "../../../utils/enums";

const FAKE_TOKEN = "token"
const DECRYPT_RESULT = "result"
const ROLE = AccountType.USER
let db: DbLoadAccountByToken
let decrypter: Decrypter

class DecrypterStub implements Decrypter{
    async decrypt(value: string): Promise<string | null> {
        console.log(value)

        return await new Promise(resolve => resolve(DECRYPT_RESULT));
    }
}

describe(DbLoadAccountByToken.name, () => {
    beforeEach(() => {
        decrypter = new DecrypterStub()
        db = new DbLoadAccountByToken(decrypter)
    })

    it("Should call Decrypter with correct values", async () => {
        const decrypterSpy = jest.spyOn(decrypter, "decrypt")

        await db.loadByToken(FAKE_TOKEN, ROLE)

        expect(decrypterSpy).toHaveBeenCalledWith(FAKE_TOKEN)
    })

    it("Should return null if Decrypter returns null", async () => {
        jest.spyOn(decrypter, "decrypt").mockReturnValueOnce(new Promise(resolve => resolve(null)))

        const account = await db.loadByToken(FAKE_TOKEN, ROLE)

        expect(account).toBeNull()
    })
})
