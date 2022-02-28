import { Authentication, AuthenticationModel } from "../../../domain/use-cases/authentication";
import { AccountModel } from "../../../domain/models/account";
import { LoadAccountByEmailRepository } from "../../protocols/db/load-account-by-email-repository";
import { DbAuthentication } from "./db-authentication";
import { HashComparer } from "../../protocols/criptography/hash-comparer";
import { TokenGenerator } from "../../protocols/criptography/token-generator";

const DEFAULT_EMAIL = "email@email.email";
const DEFAULT_PASSWORD = "1a2b3c4d";
const ACCOUNT_PASSWORD = "password";
const ACCOUNT_ID = "id";
const TOKEN = "token";
const createAuthModel = (): AuthenticationModel => ({ email: DEFAULT_EMAIL, password: DEFAULT_PASSWORD });

class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load (email: string): Promise<AccountModel> {
        const account = { email, id: ACCOUNT_ID, name: "name", password: ACCOUNT_PASSWORD };

        return await new Promise(resolve => resolve(account));
    }
}

class HashComparerStub implements HashComparer {
    async compare (value: string, hash: string): Promise<boolean> {
        console.log(value, hash);

        return await new Promise(resolve => resolve(true));
    }
}

class TokenGeneratorStub implements TokenGenerator {
    async generate (id: string): Promise<string> {
        console.log(id);

        return await new Promise(resolve => resolve(TOKEN));
    }
}

describe("DbAuthentication", () => {
    let db: Authentication;
    let loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
    let hashComparerStub: HashComparer;
    let tokenGeneratorStub: TokenGenerator;

    beforeEach(() => {
        loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub();
        hashComparerStub = new HashComparerStub();
        tokenGeneratorStub = new TokenGeneratorStub();
        db = new DbAuthentication(loadAccountByEmailRepositoryStub, hashComparerStub, tokenGeneratorStub);
    });

    it("Should call LoadAccountByEmailRepository with correct email when was called", async () => {
        const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, "load");

        await db.auth(createAuthModel());

        expect(loadSpy).toHaveBeenCalledWith(DEFAULT_EMAIL);
    });

    it("Should throw an error if LoadAccountByEmailRepository throws when was called", async () => {
        jest.spyOn(loadAccountByEmailRepositoryStub, "load")
            .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));

        const promise = db.auth(createAuthModel());

        await expect(promise).rejects.toThrow();
    });

    it("Should return null if LoadAccountByEmailRepository returns null when was called", async () => {
        jest.spyOn(loadAccountByEmailRepositoryStub, "load").mockReturnValueOnce(new Promise(resolve => resolve(null)));

        const response = await db.auth(createAuthModel());

        expect(response).toBeNull();
    });

    it("Should call HashComparer with correct values when was called", async () => {
        const compareSpy = jest.spyOn(hashComparerStub, "compare");

        await db.auth(createAuthModel());

        expect(compareSpy).toHaveBeenCalledWith(ACCOUNT_PASSWORD, DEFAULT_PASSWORD);
    });

    it("Should return an error if HashComparer throws when was called", async () => {
        jest.spyOn(hashComparerStub, "compare")
            .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));

        const promise = db.auth(createAuthModel());

        await expect(promise).rejects.toThrow();
    });

    it("Should return null if HashComparer returns false when was called", async () => {
        jest.spyOn(hashComparerStub, "compare").mockReturnValueOnce(new Promise(resolve => resolve(false)));

        const response = await db.auth(createAuthModel());

        expect(response).toBeNull();
    });

    it("Should call TokenGenerator with correct id when was called", async () => {
        const generateSpy = jest.spyOn(tokenGeneratorStub, "generate");

        await db.auth(createAuthModel());

        expect(generateSpy).toHaveBeenCalledWith(ACCOUNT_ID);
    });

    it("Should return an error if TokenGenerator throws when was called", async () => {
        jest.spyOn(tokenGeneratorStub, "generate")
            .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));

        const promise = db.auth(createAuthModel());

        await expect(promise).rejects.toThrow();
    });

    it("Should return token on success when TokenGenerator was called", async () => {
        const token = await db.auth(createAuthModel());

        expect(token).toBe(TOKEN);
    });
});
