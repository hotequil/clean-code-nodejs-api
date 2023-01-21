import { Collection } from "mongodb";
import { MongodbHelper } from "../helpers/mongodb-helper";
import { AccountMongoRepository } from "./account-mongo-repository";
import { copy } from "@/presentation/helpers/manipulator-helper";
import { AccountModel } from "@/domain/models/account";
import { AccountType } from "@/utils/enums";
import { mockAddAccountParams } from "@/utils/tests";

const ACCOUNT = mockAddAccountParams();
const TOKEN = "user1234";
const ROLE = AccountType.ADMIN

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

        it("Should return an account when loadByToken was called with role", async () => {
            const account = { ...ACCOUNT, accessToken: TOKEN, role: ROLE }

            await collection.insertOne(copy(account))

            const { id, ...otherAccountProps } = await repository.loadByToken(TOKEN, ROLE) as AccountModel;

            expect(id).toBeTruthy();
            expect(account).toEqual(otherAccountProps);
        })

        it("Should return null when loadByToken was called with an invalid role", async () => {
            const account = { ...ACCOUNT, accessToken: TOKEN, role: AccountType.USER }

            await collection.insertOne(copy(account))

            const response = await repository.loadByToken(TOKEN, ROLE) as AccountModel;

            expect(response).toBeNull();
        })

        it("Should return an account when loadByToken was called with a valid role on non admin route", async () => {
            const account = { ...ACCOUNT, accessToken: TOKEN, role: ROLE }

            await collection.insertOne(copy(account))

            const { id, ...otherAccountProps } = await repository.loadByToken(TOKEN) as AccountModel;

            expect(id).toBeTruthy();
            expect(account).toEqual(otherAccountProps);
        })

        it("Should return null if loadByToken fails when decrypt was called", async () => {
            const account = await repository.loadByToken(TOKEN, ROLE)

            expect(account).toBeNull()
        })
    })
});
