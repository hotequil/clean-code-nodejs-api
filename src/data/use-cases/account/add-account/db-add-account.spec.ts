import { DbAddAccount } from "./db-add-account";
import {
    AccountModel,
    AddAccount,
    AddAccountParams,
    AddAccountRepository,
    Hasher,
    LoadAccountByEmailRepository
} from "./db-add-account-protocols";

let db: AddAccount;
let hasherSub: Hasher;
let addAccountRepositoryStub: AddAccountRepository;
let loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
const HASHED_PASSWORD = "12345678";
const ID = "123";
const EMAIL = "test@email.com";

const makeFakeAccount = (): any => (
    {
        name: "name",
        email: EMAIL,
        password: "password"
    }
);

class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
        console.log(value);

        return await new Promise(resolve => resolve(HASHED_PASSWORD));
    }
}

class AddAccountRepositoryStub implements AddAccountRepository {
    async add (account: AddAccountParams): Promise<AccountModel> {
        const fakeAccount: AccountModel = {
            ...account,
            password: HASHED_PASSWORD,
            id: ID
        };

        return await new Promise(resolve => resolve(fakeAccount));
    }
}

class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<null> {
        console.log(email)

        return await new Promise(resolve => resolve(null));
    }
}

describe("DbAddAccount", () => {
    beforeEach(() => {
        hasherSub = new HasherStub();
        addAccountRepositoryStub = new AddAccountRepositoryStub();
        loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub();
        db = new DbAddAccount(hasherSub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub);
    });

    it("Should call Hasher with correct password", async () => {
        const hashSpy = jest.spyOn(hasherSub, "hash");
        const data = makeFakeAccount();
        const { password } = data;

        await db.add(data);

        expect(hashSpy).toHaveBeenCalledWith(password);
    });

    it("Should throw an log when Hasher throws", async () => {
        jest.spyOn(hasherSub, "hash")
            .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));

        const promise = db.add(makeFakeAccount());

        await expect(promise).rejects.toThrow();
    });

    it("Should call AddAccountRepository with correct values when was called", async () => {
        const addSpy = jest.spyOn(addAccountRepositoryStub, "add");
        const data = makeFakeAccount();

        await db.add(data);

        expect(addSpy).toHaveBeenCalledWith({ ...data, password: HASHED_PASSWORD });
    });

    it("Should throw an log when AddAccountRepository throws", async () => {
        jest.spyOn(addAccountRepositoryStub, "add")
            .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));

        const promise = db.add(makeFakeAccount());

        await expect(promise).rejects.toThrow();
    });

    it("Should return an account on success when DbAddAccount was called", async () => {
        const account = await db.add(makeFakeAccount());

        expect(account).toEqual({ ...account, id: ID, password: HASHED_PASSWORD });
    });

    it("Should call LoadAccountByEmailRepository with correct email when was called", async () => {
        const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, "loadByEmail");

        await db.add(makeFakeAccount());

        expect(loadSpy).toHaveBeenCalledWith(EMAIL);
    });

    it("Should return null if LoadAccountByEmailRepository find an account with email", async () => {
        const fakeAccount = makeFakeAccount();

        jest.spyOn(loadAccountByEmailRepositoryStub, "loadByEmail")
            .mockReturnValueOnce(new Promise(resolve => resolve(fakeAccount)))

        const account = await db.add(fakeAccount);

        expect(account).toBeNull();
    });
});
