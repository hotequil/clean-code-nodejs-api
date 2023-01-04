import request from "supertest";
import StatusCode from "status-code-enum";
import { Collection } from "mongodb";
import app from "../config/app";
import { MongodbHelper } from "../../infra/db/mongodb/helpers/mongodb-helper";
import { AddSurveyModel } from "../../domain/use-cases/add-survey";

let collection: Collection;

const makeAddSurveyModel = (): AddSurveyModel => ({
    question: "question",
    answers: [{ answer: "answer", image: "image" }, { answer: "answer", image: "image" }, { answer: "answer", image: "image" }]
})

describe("SurveyRoutes", () => {
    beforeAll(async () => await MongodbHelper.connect());
    afterAll(async () => await MongodbHelper.disconnect());

    beforeEach(async () => {
        collection = await MongodbHelper.collection("surveys");

        await collection.deleteMany({});
    });

    it(`Should return code ${StatusCode.SuccessNoContent} when POST in /api/surveys was called`, async () => {
        await request(app).post("/api/surveys")
                          .send(makeAddSurveyModel())
                          .expect(StatusCode.SuccessNoContent);
    });
});
