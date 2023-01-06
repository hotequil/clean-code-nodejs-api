import { DbLoadAccountByToken } from "./db-load-account-by-token";
import { Decrypter } from "./db-load-account-by-token-protocols";

const FAKE_TOKEN = "token"
let db: DbLoadAccountByToken
let decrypter: Decrypter

class DecrypterStub implements Decrypter{
    async decrypt(value: string): Promise<string> {
        console.log(value)

        return await new Promise(resolve => resolve("result"));
    }
}

describe(DbLoadAccountByToken.name, () => {
    beforeEach(() => {
        decrypter = new DecrypterStub()
        db = new DbLoadAccountByToken(decrypter)
    })

    it("Should call Decrypter with correct values", async () => {
        const decrypterSpy = jest.spyOn(decrypter, "decrypt")

        await db.loadByToken(FAKE_TOKEN)

        expect(decrypterSpy).toHaveBeenCalledWith(FAKE_TOKEN)
    })
})
