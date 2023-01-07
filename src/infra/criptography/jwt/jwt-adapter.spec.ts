import jwt from "jsonwebtoken";
import { JwtAdapter } from "./jwt-adapter";

const ID = "user1234";
const SECRET = "secret";
const TOKEN = "token";
const VALUE = { id: ID };
const ENCRYPTED_TOKEN = "test"

jest.mock("jsonwebtoken", () => ({
    sign () {
        return TOKEN;
    },
    verify(token: string){
        console.log(token)

        return TOKEN
    },
}));

describe("JwtAdapter", () => {
    let adapter: JwtAdapter;

    beforeEach(() => adapter = new JwtAdapter(SECRET));

    describe("encrypt()", () => {
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
    })

    describe("decrypt()", () => {
        it("Should call verify with correct values", async () => {
            const verifySpy = jest.spyOn(jwt, "verify")

            await adapter.decrypt(ENCRYPTED_TOKEN)

            expect(verifySpy).toHaveBeenCalledWith(ENCRYPTED_TOKEN, SECRET)
        })
    })
});
