import { DbAddAccount } from "./db-add-account";
import { AddAccount, Encrypter } from "./db-add-account-protocols";

let db: AddAccount;
let encrypterSub: Encrypter;

class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
        return await new Promise(resolve => resolve(value));
    }
}

describe("DbAddAccount", () => {
    beforeEach(() => {
        encrypterSub = new EncrypterStub();
        db = new DbAddAccount(encrypterSub);
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
});
