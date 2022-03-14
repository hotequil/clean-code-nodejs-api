import { Collection } from "mongodb";

import { MongodbHelper } from "../helpers/mongodb-helper";
import { Account } from "./account";
import { copy } from "../../../../presentation/helpers/manipulator-helper";
import { AccountModel } from "../../../../domain/models/account";

const ACCOUNT = { name: "name", email: "email@email.email", password: "password" };

describe("AccountMongoDBRepository", () => {
    let repository: Account;
    let collection: Collection;

    beforeAll(async () => await MongodbHelper.connect());

    afterAll(async () => await MongodbHelper.disconnect());

    beforeEach(async () => {
        collection = await MongodbHelper.collection("accounts");

        await collection.deleteMany({});

        repository = new Account();
    });

    it("Should return a new account when add was called", async () => {
        const { id, name, email, password } = await repository.add(copy(ACCOUNT));

        expect(id).toBeTruthy();
        expect(ACCOUNT).toEqual({ name, email, password });
    });

    it("Should return an account when loadByEmail was called", async () => {
        await collection.insertOne(copy(ACCOUNT));

        const { id, name, email, password } = await repository.loadByEmail(ACCOUNT.email) as AccountModel;

        expect(id).toBeTruthy();
        expect(ACCOUNT).toEqual({ name, email, password });
    });

    it("Should return null if there is no account with email when was called", async () => {
        const account = await repository.loadByEmail(ACCOUNT.email);

        expect(account).toBe(null);
    });
});
