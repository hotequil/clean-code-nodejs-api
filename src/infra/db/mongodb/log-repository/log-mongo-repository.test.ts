import { Collection } from "mongodb";

import { MongodbHelper } from "../helpers/mongodb-helper";
import { LogMongoRepository } from "./log-mongo-repository";

describe("LogMongoRepository", () => {
    let repository: LogMongoRepository;
    let errors: Collection;

    beforeAll(async () => await MongodbHelper.connect());
    afterAll(async () => await MongodbHelper.disconnect());

    beforeEach(async () => {
        errors = await MongodbHelper.collection("errors");

        await errors.deleteMany({});

        repository = new LogMongoRepository();
    });

    it("Should save an error log when was called", async () => {
        let count = 0;

        await repository.logError("error");

        count = await errors.countDocuments();

        expect(count).toBeTruthy();
    });
});
