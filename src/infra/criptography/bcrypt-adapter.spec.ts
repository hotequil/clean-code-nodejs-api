import bcrypt from "bcrypt";

import { Hasher } from "../../data/protocols/criptography/hasher";
import { BcryptAdapter } from "./bcrypt-adapter";

let bcryptAdapter: Hasher;
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

        await bcryptAdapter.hash(value);

        expect(spyHash).toHaveBeenCalledWith(value, SALT);
    });

    it("Should return a hash when was called on success", async () => {
        const hash = await bcryptAdapter.hash("aleatory");

        expect(hash).toBe(DEFAULT_VALUE);
    });

    it("Should throw an error when Bcrypt throws", async () => {
        jest.spyOn(bcrypt, "hash")
            .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())) as unknown as any);

        const promise = bcryptAdapter.hash("hash");

        await expect(promise).rejects.toThrow();
    });
});
