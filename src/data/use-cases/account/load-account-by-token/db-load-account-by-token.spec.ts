import { DbLoadAccountByToken } from "./db-load-account-by-token";
import { type Decrypter, type LoadAccountByTokenRepository } from "./db-load-account-by-token-protocols";
import { AccountType } from "@/utils/enums";
import { mockAccountModel, mockDecrypter, mockLoadAccountByTokenRepository, throwError } from "@/utils/tests";

const FAKE_TOKEN = "token"
const DECRYPT_RESULT = "result"
const ROLE = AccountType.USER
let db: DbLoadAccountByToken
let decrypter: Decrypter
let loadAccountByTokenRepository: LoadAccountByTokenRepository

describe(DbLoadAccountByToken.name, () => {
    beforeEach(() => {
        decrypter = mockDecrypter(DECRYPT_RESULT)
        loadAccountByTokenRepository = mockLoadAccountByTokenRepository()
        db = new DbLoadAccountByToken(decrypter, loadAccountByTokenRepository)
    })

    it("Should call Decrypter with correct values", async () => {
        const decrypterSpy = jest.spyOn(decrypter, "decrypt")

        await db.loadByToken(FAKE_TOKEN, ROLE)

        expect(decrypterSpy).toHaveBeenCalledWith(FAKE_TOKEN)
    })

    it("Should return null if Decrypter returns null", async () => {
        jest.spyOn(decrypter, "decrypt").mockReturnValueOnce(Promise.resolve(null))

        const result = await db.loadByToken(FAKE_TOKEN, ROLE)

        expect(result).toBeNull()
    })

    it("Should call LoadAccountByTokenRepository with correct values", async () => {
        const loadAccountByTokenRepositorySpy = jest.spyOn(loadAccountByTokenRepository, "loadByToken")

        await db.loadByToken(FAKE_TOKEN, ROLE)

        expect(loadAccountByTokenRepositorySpy).toHaveBeenCalledWith(FAKE_TOKEN, ROLE)
    })

    it("Should return null if LoadAccountByTokenRepository returns null", async () => {
        jest.spyOn(loadAccountByTokenRepository, "loadByToken").mockReturnValueOnce(Promise.resolve(null))

        const result = await db.loadByToken(FAKE_TOKEN, ROLE)

        expect(result).toBeNull()
    })

    it("Should return an account on success", async () => {
        const result = await db.loadByToken(FAKE_TOKEN, ROLE)
        const { id } = mockAccountModel()

        expect(result).toEqual({ id })
    })

    it("Should return null if Decrypter throws", async () => {
        jest.spyOn(decrypter, "decrypt").mockImplementationOnce(throwError)

        const result = await db.loadByToken(FAKE_TOKEN, ROLE)

        expect(result).toBeNull()
    })

    it("Should throw if LoadAccountByTokenRepository throws", async () => {
        jest.spyOn(loadAccountByTokenRepository, "loadByToken").mockImplementationOnce(throwError)

        const promise = db.loadByToken(FAKE_TOKEN, ROLE)

        await expect(promise).rejects.toThrow()
    })
})
