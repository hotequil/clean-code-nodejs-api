import bcrypt from "bcrypt";

import { Encrypter } from "../../data/protocols/encrypter";
import { BcryptAdapter } from "./bcrypt-adapter";

let bcryptAdapter: Encrypter;
const SALT = 12;

describe("BcryptAdapter", () => {
    beforeEach(() => bcryptAdapter = new BcryptAdapter(SALT));

    it("Should call Bcrypt with correct values when was called", async () => {
        const spyHash = jest.spyOn(bcrypt, "hash");
        const value = "1234";

        await bcryptAdapter.encrypt(value);

        expect(spyHash).toHaveBeenCalledWith(value, SALT);
    });
});
