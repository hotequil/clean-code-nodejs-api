import { DbAuthentication } from "./db-authentication";
import {
    Authentication,
    AuthenticationModel,
    AccountModel,
    LoadAccountByEmailRepository,
    HashComparer,
    Encrypter,
    UpdateAccessTokenRepository
} from "./db-authentication-protocols";

const DEFAULT_EMAIL = "email@email.email";
const DEFAULT_PASSWORD = "1a2b3c4d";
const ACCOUNT_PASSWORD = "password";
const ACCOUNT_ID = "id";
const TOKEN = "token";
const createAuthModel = (): AuthenticationModel => ({ email: DEFAULT_EMAIL, password: DEFAULT_PASSWORD });

class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel> {
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

class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
        console.log(value);

        return await new Promise(resolve => resolve(TOKEN));
    }
}

class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async update (id: string, token: string): Promise<void> {
        console.log(id, token);

        await new Promise<void>(resolve => resolve());
    }
}

describe("DbAuthentication", () => {
    let db: Authentication;
    let loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
    let hashComparerStub: HashComparer;
    let encrypterStub: Encrypter;
    let updateAccessTokenRepositoryStub: UpdateAccessTokenRepository;

    beforeEach(() => {
        loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub();
        hashComparerStub = new HashComparerStub();
        encrypterStub = new EncrypterStub();
        updateAccessTokenRepositoryStub = new UpdateAccessTokenRepositoryStub();
        db = new DbAuthentication(loadAccountByEmailRepositoryStub, hashComparerStub, encrypterStub, updateAccessTokenRepositoryStub);
    });

    it("Should call LoadAccountByEmailRepository with correct email when was called", async () => {
        const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, "loadByEmail");

        await db.auth(createAuthModel());

        expect(loadSpy).toHaveBeenCalledWith(DEFAULT_EMAIL);
    });

    it("Should throw an error if LoadAccountByEmailRepository throws when was called", async () => {
        jest.spyOn(loadAccountByEmailRepositoryStub, "loadByEmail")
            .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));

        const promise = db.auth(createAuthModel());

        await expect(promise).rejects.toThrow();
    });

    it("Should return null if LoadAccountByEmailRepository returns null when was called", async () => {
        jest.spyOn(loadAccountByEmailRepositoryStub, "loadByEmail").mockReturnValueOnce(new Promise(resolve => resolve(null)));

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

    it("Should call Encrypter with correct id when was called", async () => {
        const encryptSpy = jest.spyOn(encrypterStub, "encrypt");

        await db.auth(createAuthModel());

        expect(encryptSpy).toHaveBeenCalledWith(ACCOUNT_ID);
    });

    it("Should return an error if Encrypter throws when was called", async () => {
        jest.spyOn(encrypterStub, "encrypt")
            .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));

        const promise = db.auth(createAuthModel());

        await expect(promise).rejects.toThrow();
    });

    it("Should return token on success when Encrypter was called", async () => {
        const token = await db.auth(createAuthModel());

        expect(token).toBe(TOKEN);
    });

    it("Should call UpdateAccessTokenRepository with correct values when was called", async () => {
        const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, "update");

        await db.auth(createAuthModel());

        expect(updateSpy).toHaveBeenCalledWith(ACCOUNT_ID, TOKEN);
    });

    it("Should return an error if UpdateAccessTokenRepository throws when was called", async () => {
        jest.spyOn(updateAccessTokenRepositoryStub, "update")
            .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));

        const promise = db.auth(createAuthModel());

        await expect(promise).rejects.toThrow();
    });
});
