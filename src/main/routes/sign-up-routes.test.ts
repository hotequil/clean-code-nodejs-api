import request from "supertest";
import StatusCode from "status-code-enum";

import app from "../config/app";
import { MongodbHelper } from "../../infra/db/mongodb/helpers/mongodb-helper";

describe("SignUpRoutes", () => {
    beforeAll(async () => await MongodbHelper.connect());
    afterAll(async () => await MongodbHelper.disconnect());

    beforeEach(async () => {
        const collection = await MongodbHelper.collection("accounts");

        await collection.deleteMany({});
    });

    it(`Should return status code ${StatusCode.SuccessOK} when send a post to route /api/sign-up with data`, async () => {
        const data = {
            name: "name",
            email: "email@email.email",
            password: "passwordAndConfirmation",
            passwordConfirmation: "passwordAndConfirmation"
        };

        await request(app).post("/api/sign-up").send(data).expect(StatusCode.SuccessOK);
    });
});
