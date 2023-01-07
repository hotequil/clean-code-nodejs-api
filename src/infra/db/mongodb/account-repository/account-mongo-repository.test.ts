import { Collection } from "mongodb";
import { MongodbHelper } from "../helpers/mongodb-helper";
import { AccountMongoRepository } from "./account-mongo-repository";
import { copy } from "../../../../presentation/helpers/manipulator-helper";
import { AccountModel } from "../../../../domain/models/account";

const ACCOUNT = { name: "name", email: "email@email.email", password: "password" };
const TOKEN = "user1234";

describe("AccountMongoDBRepository", () => {
    let repository: AccountMongoRepository;
    let collection: Collection;

    beforeAll(async () => await MongodbHelper.connect());

    afterAll(async () => await MongodbHelper.disconnect());

    beforeEach(async () => {
        collection = await MongodbHelper.collection("accounts");

        await collection.deleteMany({});

        repository = new AccountMongoRepository();
    });

    describe("add()", () => {
        it("Should return a new account when add was called", async () => {
            const { id, name, email, password } = await repository.add(copy(ACCOUNT));

            expect(id).toBeTruthy();
            expect(ACCOUNT).toEqual({ name, email, password });
        });
    })

    describe("loadByEmail()", () => {
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
    })

    describe("updateAccessToken()", () => {
        it("Should update the accessToken when updateAccessToken was called", async () => {
            const { insertedId } = await collection.insertOne(copy(ACCOUNT));

            await repository.updateAccessToken(insertedId, TOKEN);

            const { accessToken } = await collection.findOne<AccountModel>({ _id: insertedId }) as AccountModel;

            expect(accessToken).toBe(TOKEN);
        });
    })

    describe("loadByToken()", () => {
        it("Should return an account when loadByToken was called without role", async () => {
            const account = { ...ACCOUNT, accessToken: TOKEN }

            await collection.insertOne(copy(account))

            const { id, ...otherAccountProps } = await repository.loadByToken(TOKEN) as AccountModel;

            expect(id).toBeTruthy();
            expect(account).toEqual(otherAccountProps);
        })
    })
});
