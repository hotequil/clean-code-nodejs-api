import { Authentication, AuthenticationModel } from "../../../domain/use-cases/authentication";
import { AccountModel } from "../../../domain/models/account";
import { LoadAccountByEmailRepository } from "../../protocols/load-account-by-email-repository";
import { DbAuthentication } from "./db-authentication";

const DEFAULT_EMAIL = "email@email.email";
const createAuthModel = (): AuthenticationModel => ({ email: DEFAULT_EMAIL, password: "1a2b3c4d" });

class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load (email: string): Promise<AccountModel> {
        const account = { email, id: "id", name: "name", password: "password" };

        return await new Promise(resolve => resolve(account));
    }
}

describe("DbAuthentication", () => {
    let db: Authentication;
    let loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;

    beforeEach(() => {
        loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub();
        db = new DbAuthentication(loadAccountByEmailRepositoryStub);
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
});
