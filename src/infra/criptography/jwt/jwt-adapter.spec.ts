import jwt from "jsonwebtoken";

import { Encrypter } from "../../../data/protocols/criptography/encrypter";
import { JwtAdapter } from "./jwt-adapter";

const ID = "user1234";
const SECRET = "secret";
const TOKEN = "token";
const VALUE = { id: ID };

jest.mock("jsonwebtoken", () => ({
    sign () {
        return TOKEN;
    }
}));

describe("JwtAdapter", () => {
    let adapter: Encrypter;

    beforeEach(() => adapter = new JwtAdapter(SECRET));

    it("Should call sign with correct values when was called", async () => {
        const signSpy = jest.spyOn(jwt, "sign");

        await adapter.encrypt(ID);

        expect(signSpy).toHaveBeenCalledWith(VALUE, SECRET);
    });

    it("Should return a token when encrypt was called", async () => {
        const token = await adapter.encrypt(ID);

        expect(token).toBe(TOKEN);
    });

    it("Should throw if sign throws when encrypt was called", async () => {
        // @ts-ignore
        jest.spyOn(jwt, "sign").mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));

        const promise = adapter.encrypt(ID);

        await expect(promise).rejects.toThrow();
    });
});
