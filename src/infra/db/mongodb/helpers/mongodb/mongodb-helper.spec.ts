import { MongodbHelper } from "./mongodb-helper";

describe("MongoDBHelper", () => {
    beforeAll(async () => { await MongodbHelper.connect(); });
    afterAll(async () => { await MongodbHelper.disconnect(); });

    it("Should reconnect to mongo when call collection and is disconnected", async () => {
        const accountsConnected = await MongodbHelper.collection("accounts");

        expect(accountsConnected).toBeTruthy();

        await MongodbHelper.disconnect();

        const accountsDisconnected = await MongodbHelper.collection("accounts");

        expect(accountsDisconnected).toBeTruthy();
    });

    it("Should return a correct object after map when was called", () => {
        const beforeObject = { _id: 1, name: "name" };
        const afterObject = { id: 1, name: "name" };
        const afterMap = MongodbHelper.map(beforeObject);

        expect(afterMap).toEqual(afterObject);
    });
});
