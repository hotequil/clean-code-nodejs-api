import bcrypt from "bcrypt";

import { BcryptAdapter } from "./bcrypt-adapter";

let bcryptAdapter: BcryptAdapter;
const SALT = 12;
const DEFAULT_VALUE = "test";
const DEFAULT_HASH = "1a2b3c4d";

jest.mock("bcrypt", () => ({
    async hash () {
        return await new Promise(resolve => resolve(DEFAULT_VALUE));
    },
    async compare (value: string, hash: string) {
        console.log(value, hash);

        return await new Promise(resolve => resolve(true));
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

    it("Should call compare with correct values when was called", async () => {
        const compareSpy = jest.spyOn(bcrypt, "compare");

        await bcryptAdapter.compare(DEFAULT_VALUE, DEFAULT_HASH);

        expect(compareSpy).toHaveBeenCalledWith(DEFAULT_VALUE, DEFAULT_HASH);
    });

    it("Should return true when compare was called", async () => {
        const response = await bcryptAdapter.compare(DEFAULT_VALUE, DEFAULT_HASH);

        expect(response).toBe(true);
    });

    it("Should return false when compare fails", async () => {
        // @ts-ignore
        jest.spyOn(bcrypt, "compare").mockReturnValueOnce(new Promise(resolve => resolve(false)));

        const response = await bcryptAdapter.compare(DEFAULT_VALUE, DEFAULT_HASH);

        expect(response).toBe(false);
    });
});
