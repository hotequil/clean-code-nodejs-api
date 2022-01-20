import { DbAddAccount } from "./db-add-account";
import { AccountModel, AddAccount, AddAccountModel, AddAccountRepository, Encrypter } from "./db-add-account-protocols";

let db: AddAccount;
let encrypterSub: Encrypter;
let addAccountRepositoryStub: AddAccountRepository;
const HASHED_PASSWORD = "12345678";

class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
        console.log(value);

        return await new Promise(resolve => resolve(HASHED_PASSWORD));
    }
}

class AddAccountRepositoryStub implements AddAccountRepository {
    async add (account: AddAccountModel): Promise<AccountModel> {
        const fakeAccount: AccountModel = {
            ...account,
            password: HASHED_PASSWORD,
            id: "123"
        };

        return await new Promise(resolve => resolve(fakeAccount));
    }
}

describe("DbAddAccount", () => {
    beforeEach(() => {
        encrypterSub = new EncrypterStub();
        addAccountRepositoryStub = new AddAccountRepositoryStub();
        db = new DbAddAccount(encrypterSub, addAccountRepositoryStub);
    });

    it("Should call Encrypter with correct password", async () => {
        const encryptSpy = jest.spyOn(encrypterSub, "encrypt");
        const password = "password";

        const data = {
            name: "name",
            email: "email@email.email",
            password
        };

        await db.add(data);

        expect(encryptSpy).toHaveBeenCalledWith(password);
    });

    it("Should throw an error when Encrypter throws", async () => {
        jest.spyOn(encrypterSub, "encrypt")
            .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));

        const data = {
            name: "name",
            email: "email@email.email",
            password: "password"
        };

        const promise = db.add(data);

        await expect(promise).rejects.toThrow();
    });

    it("Should call AddAccountRepository with correct values when was called", async () => {
        const addSpy = jest.spyOn(addAccountRepositoryStub, "add");

        const data = {
            name: "name",
            email: "email@email.email",
            password: "password"
        };

        await db.add(data);

        expect(addSpy).toHaveBeenCalledWith({ ...data, password: HASHED_PASSWORD });
    });

    it("Should throw an error when AddAccountRepository throws", async () => {
        jest.spyOn(addAccountRepositoryStub, "add")
            .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));

        const data = {
            name: "name",
            email: "email@email.email",
            password: "password"
        };

        const promise = db.add(data);

        await expect(promise).rejects.toThrow();
    });
});
