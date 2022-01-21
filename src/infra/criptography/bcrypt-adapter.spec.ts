import bcrypt from "bcrypt";

import { Encrypter } from "../../data/protocols/encrypter";
import { BcryptAdapter } from "./bcrypt-adapter";

let bcryptAdapter: Encrypter;
const SALT = 12;
const DEFAULT_VALUE = "test";

jest.mock("bcrypt", () => ({
    async hash () {
        return await new Promise(resolve => resolve(DEFAULT_VALUE));
    }
}));

describe("BcryptAdapter", () => {
    beforeEach(() => bcryptAdapter = new BcryptAdapter(SALT));

    it("Should call Bcrypt with correct values when was called", async () => {
        const spyHash = jest.spyOn(bcrypt, "hash");
        const value = "1234";

        await bcryptAdapter.encrypt(value);

        expect(spyHash).toHaveBeenCalledWith(value, SALT);
    });

    it("Should return a hash when was called on success", async () => {
        const hash = await bcryptAdapter.encrypt("aleatory");

        expect(hash).toBe(DEFAULT_VALUE);
    });
});
