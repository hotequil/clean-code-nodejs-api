import bcrypt from "bcrypt";
import { BcryptAdapter } from "./bcrypt-adapter";
import { throwError } from "@/utils/tests";

let bcryptAdapter: BcryptAdapter;
const SALT = 12;
const DEFAULT_VALUE = "test";
const DEFAULT_HASH = "1a2b3c4d";

jest.mock("bcrypt", () => ({
    async hash () {
        return DEFAULT_VALUE;
    },
    async compare (value: string, hash: string) {
        console.log(value, hash);

        return true;
    }
}));

describe("BcryptAdapter", () => {
    beforeEach(() => bcryptAdapter = new BcryptAdapter(SALT));

    describe("hash()", () => {
        it("Should call hash with correct values when was called", async () => {
            const spyHash = jest.spyOn(bcrypt, "hash");
            const value = "1234";

            await bcryptAdapter.hash(value);

            expect(spyHash).toHaveBeenCalledWith(value, SALT);
        });

        it("Should return a hash when was called on success", async () => {
            const hash = await bcryptAdapter.hash("aleatory");

            expect(hash).toBe(DEFAULT_VALUE);
        });

        it("Should throw an log when hash throws", async () => {
            jest.spyOn(bcrypt, "hash").mockImplementationOnce(throwError)

            const promise = bcryptAdapter.hash("hash");

            await expect(promise).rejects.toThrow();
        });
    })

    describe("compare()", () => {
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
            jest.spyOn(bcrypt, "compare").mockReturnValueOnce(Promise.resolve(false));

            const response = await bcryptAdapter.compare(DEFAULT_VALUE, DEFAULT_HASH);

            expect(response).toBe(false);
        });

        it("Should throw an log when compare throws", async () => {
            jest.spyOn(bcrypt, "compare").mockImplementationOnce(throwError)

            const promise = bcryptAdapter.compare(DEFAULT_VALUE, DEFAULT_HASH);

            await expect(promise).rejects.toThrow();
        });
    })
});
