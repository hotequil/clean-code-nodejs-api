import { DbAddAccount } from "./db-add-account";
import { type AddAccount, type AddAccountRepository, type CheckAccountByEmailRepository, type Hasher } from "./db-add-account-protocols";
import {
    mockAccountModel,
    mockAddAccountParams,
    mockAddAccountRepository,
    mockHasher,
    mockCheckAccountByEmailRepository,
    throwError
} from "@/utils/tests";

let db: AddAccount;
let hasherSub: Hasher;
let addAccountRepositoryStub: AddAccountRepository;
let checkAccountByEmailRepositoryStub: CheckAccountByEmailRepository;
const HASHED_PASSWORD = "12345678";
const ID = "123";

describe("DbAddAccount", () => {
    beforeEach(() => {
        hasherSub = mockHasher(HASHED_PASSWORD);
        addAccountRepositoryStub = mockAddAccountRepository(ID, HASHED_PASSWORD);
        checkAccountByEmailRepositoryStub = mockCheckAccountByEmailRepository();
        db = new DbAddAccount(hasherSub, addAccountRepositoryStub, checkAccountByEmailRepositoryStub);
    });

    it("Should call Hasher with correct password", async () => {
        const hashSpy = jest.spyOn(hasherSub, "hash");
        const data = mockAddAccountParams();
        const { password } = data;

        await db.add(data);

        expect(hashSpy).toHaveBeenCalledWith(password);
    });

    it("Should throw an log when Hasher throws", async () => {
        jest.spyOn(hasherSub, "hash").mockImplementationOnce(throwError)

        const promise = db.add(mockAddAccountParams());

        await expect(promise).rejects.toThrow();
    });

    it("Should call AddAccountRepository with correct values when was called", async () => {
        const addSpy = jest.spyOn(addAccountRepositoryStub, "add");
        const data = mockAddAccountParams();

        await db.add(data);

        expect(addSpy).toHaveBeenCalledWith({ ...data, password: HASHED_PASSWORD });
    });

    it("Should throw an log when AddAccountRepository throws", async () => {
        jest.spyOn(addAccountRepositoryStub, "add").mockImplementationOnce(throwError)

        const promise = db.add(mockAddAccountParams());

        await expect(promise).rejects.toThrow();
    });

    it("Should return an account on success when DbAddAccount was called", async () => {
        const result = await db.add(mockAddAccountParams());

        expect(result).toBe(true);
    });

    it("Should call CheckAccountByEmailRepository with correct email when was called", async () => {
        const loadSpy = jest.spyOn(checkAccountByEmailRepositoryStub, "checkByEmail");
        const account = mockAddAccountParams()
        const { email } = account

        await db.add(account);

        expect(loadSpy).toHaveBeenCalledWith(email);
    });

    it("Should return false if CheckAccountByEmailRepository returns true", async () => {
        const fakeAccount = mockAccountModel();

        jest.spyOn(checkAccountByEmailRepositoryStub, "checkByEmail").mockReturnValueOnce(Promise.resolve(true))

        const result = await db.add(fakeAccount);

        expect(result).toBe(false);
    });
});
