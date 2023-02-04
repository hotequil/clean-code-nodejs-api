import { Collection } from "mongodb";
import { MongodbHelper } from "../helpers";
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

    it("Should save an log log when was called", async () => {
        await repository.logError("error");

        const count = await errors.countDocuments();

        expect(count).toBeTruthy();
    });
});
