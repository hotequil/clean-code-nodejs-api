import { Encrypter } from "../../protocols/encrypter";
import { DbAddAccount } from "./db-add-account";
import { AddAccount } from "../../../domain/use-cases/add-account";

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
});
