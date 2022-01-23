import { MongodbHelper } from "../helpers/mongodb-helper";
import { Account } from "./account";
import { copy } from "../../../../presentation/helpers/manipulator-helper";

describe("AccountMongoDBRepository", () => {
    let repository: Account;

    beforeAll(async () => await MongodbHelper.connect());

    afterAll(async () => await MongodbHelper.disconnect());

    beforeEach(async () => {
        const collection = MongodbHelper.collection("accounts");

        await collection.deleteMany({});

        repository = new Account();
    });

    it("Should return a new account when was called", async () => {
        const account = { name: "name", email: "email@email.email", password: "password" };
        const { id, name, email, password } = await repository.add(copy(account));

        expect(id).toBeTruthy();
        expect(account).toEqual({ name, email, password });
    });
});
