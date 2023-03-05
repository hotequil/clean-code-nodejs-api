import { DbAuthentication } from "./db-authentication";
import {
    Authentication,
    LoadAccountByEmailRepository,
    HashComparer,
    Encrypter,
    UpdateAccessTokenRepository
} from "./db-authentication-protocols";
import {
    mockAuthenticationParams,
    mockEncrypter,
    mockHashComparer,
    mockLoadAccountByEmailRepository,
    mockUpdateAccessTokenRepository,
    throwError
} from "@/utils/tests";

const DEFAULT_EMAIL = "email@email.email";
const DEFAULT_PASSWORD = "1a2b3c4d";
const ACCOUNT_PASSWORD = "password";
const ACCOUNT_ID = "id";
const TOKEN = "token";
const NAME = "name"

describe("DbAuthentication", () => {
    let db: Authentication;
    let loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
    let hashComparerStub: HashComparer;
    let encrypterStub: Encrypter;
    let updateAccessTokenRepositoryStub: UpdateAccessTokenRepository;

    beforeEach(() => {
        loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository({ id: ACCOUNT_ID, name: NAME, password: ACCOUNT_PASSWORD });
        hashComparerStub = mockHashComparer();
        encrypterStub = mockEncrypter(TOKEN);
        updateAccessTokenRepositoryStub = mockUpdateAccessTokenRepository();
        db = new DbAuthentication(loadAccountByEmailRepositoryStub, hashComparerStub, encrypterStub, updateAccessTokenRepositoryStub);
    });

    it("Should call LoadAccountByEmailRepository with correct email when was called", async () => {
        const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, "loadByEmail");

        await db.auth(mockAuthenticationParams(DEFAULT_EMAIL, DEFAULT_PASSWORD));

        expect(loadSpy).toHaveBeenCalledWith(DEFAULT_EMAIL);
    });

    it("Should throw an log if LoadAccountByEmailRepository throws when was called", async () => {
        jest.spyOn(loadAccountByEmailRepositoryStub, "loadByEmail").mockImplementationOnce(throwError)

        const promise = db.auth(mockAuthenticationParams(DEFAULT_EMAIL, DEFAULT_PASSWORD));

        await expect(promise).rejects.toThrow();
    });

    it("Should return null if LoadAccountByEmailRepository returns null when was called", async () => {
        jest.spyOn(loadAccountByEmailRepositoryStub, "loadByEmail").mockReturnValueOnce(Promise.resolve(null));

        const response = await db.auth(mockAuthenticationParams(DEFAULT_EMAIL, DEFAULT_PASSWORD));

        expect(response).toBeNull();
    });

    it("Should call HashComparer with correct values when was called", async () => {
        const compareSpy = jest.spyOn(hashComparerStub, "compare");

        await db.auth(mockAuthenticationParams(DEFAULT_EMAIL, DEFAULT_PASSWORD));

        expect(compareSpy).toHaveBeenCalledWith(DEFAULT_PASSWORD, ACCOUNT_PASSWORD);
    });

    it("Should return an log if HashComparer throws when was called", async () => {
        jest.spyOn(hashComparerStub, "compare").mockImplementationOnce(throwError)

        const promise = db.auth(mockAuthenticationParams(DEFAULT_EMAIL, DEFAULT_PASSWORD));

        await expect(promise).rejects.toThrow();
    });

    it("Should return null if HashComparer returns false when was called", async () => {
        jest.spyOn(hashComparerStub, "compare").mockReturnValueOnce(Promise.resolve(false));

        const response = await db.auth(mockAuthenticationParams(DEFAULT_EMAIL, DEFAULT_PASSWORD));

        expect(response).toBeNull();
    });

    it("Should call Encrypter with correct id when was called", async () => {
        const encryptSpy = jest.spyOn(encrypterStub, "encrypt");

        await db.auth(mockAuthenticationParams(DEFAULT_EMAIL, DEFAULT_PASSWORD));

        expect(encryptSpy).toHaveBeenCalledWith(ACCOUNT_ID);
    });

    it("Should return an log if Encrypter throws when was called", async () => {
        jest.spyOn(encrypterStub, "encrypt").mockImplementationOnce(throwError)

        const promise = db.auth(mockAuthenticationParams(DEFAULT_EMAIL, DEFAULT_PASSWORD));

        await expect(promise).rejects.toThrow();
    });

    it("Should return AuthenticationModel on success when Encrypter was called", async () => {
        const authenticationModel = await db.auth(mockAuthenticationParams(DEFAULT_EMAIL, DEFAULT_PASSWORD));

        expect(authenticationModel).toEqual({ token: TOKEN, name: NAME });
    });

    it("Should call UpdateAccessTokenRepository with correct values when was called", async () => {
        const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, "updateAccessToken");

        await db.auth(mockAuthenticationParams(DEFAULT_EMAIL, DEFAULT_PASSWORD));

        expect(updateSpy).toHaveBeenCalledWith(ACCOUNT_ID, TOKEN);
    });

    it("Should return an log if UpdateAccessTokenRepository throws when was called", async () => {
        jest.spyOn(updateAccessTokenRepositoryStub, "updateAccessToken").mockImplementationOnce(throwError)

        const promise = db.auth(mockAuthenticationParams(DEFAULT_EMAIL, DEFAULT_PASSWORD));

        await expect(promise).rejects.toThrow();
    });
});
