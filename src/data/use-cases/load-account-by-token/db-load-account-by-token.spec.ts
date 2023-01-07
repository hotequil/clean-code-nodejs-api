import { DbLoadAccountByToken } from "./db-load-account-by-token";
import { AccountModel, Decrypter, LoadAccountByTokenRepository } from "./db-load-account-by-token-protocols";
import { AccountType } from "../../../utils/enums";

const FAKE_TOKEN = "token"
const DECRYPT_RESULT = "result"
const ROLE = AccountType.USER
let db: DbLoadAccountByToken
let decrypter: Decrypter
let loadAccountByTokenRepository: LoadAccountByTokenRepository

const makeFakeAccountModel = (): AccountModel => ({
    email: "email@email.email",
    id: "id",
    accessToken: "accessToken",
    name: "name",
    password: "password",
})

class DecrypterStub implements Decrypter{
    async decrypt(value: string): Promise<string | null> {
        console.log(value)

        return await new Promise(resolve => resolve(DECRYPT_RESULT));
    }
}

class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository{
    async loadByToken(token: string, role?: AccountType): Promise<AccountModel | null>{
        console.log(token, role)

        return await new Promise(resolve => resolve(makeFakeAccountModel()))
    }
}

describe(DbLoadAccountByToken.name, () => {
    beforeEach(() => {
        decrypter = new DecrypterStub()
        loadAccountByTokenRepository = new LoadAccountByTokenRepositoryStub()
        db = new DbLoadAccountByToken(decrypter, loadAccountByTokenRepository)
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

    it("Should call LoadAccountByTokenRepository with correct values", async () => {
        const loadAccountByTokenRepositorySpy = jest.spyOn(loadAccountByTokenRepository, "loadByToken")

        await db.loadByToken(FAKE_TOKEN, ROLE)

        expect(loadAccountByTokenRepositorySpy).toHaveBeenCalledWith(DECRYPT_RESULT, ROLE)
    })

    it("Should return null if LoadAccountByTokenRepository returns null", async () => {
        jest.spyOn(loadAccountByTokenRepository, "loadByToken").mockReturnValueOnce(new Promise(resolve => resolve(null)))

        const account = await db.loadByToken(FAKE_TOKEN, ROLE)

        expect(account).toBeNull()
    })

    it("Should return an account on success", async () => {
        const account = await db.loadByToken(FAKE_TOKEN, ROLE)

        expect(account).toEqual(makeFakeAccountModel())
    })

    it("Should throw if Decrypter throws", async () => {
        jest.spyOn(decrypter, "decrypt")
            .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

        const promise = db.loadByToken(FAKE_TOKEN, ROLE)

        await expect(promise).rejects.toThrow()
    })

    it("Should throw if LoadAccountByTokenRepository throws", async () => {
        jest.spyOn(loadAccountByTokenRepository, "loadByToken")
            .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

        const promise = db.loadByToken(FAKE_TOKEN, ROLE)

        await expect(promise).rejects.toThrow()
    })
})
