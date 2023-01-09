import request from "supertest";
import StatusCode from "status-code-enum";
import app from "../config/app";
import { MongodbHelper } from "../../infra/db/mongodb/helpers/mongodb-helper";
import { AddSurveyModel } from "../../domain/use-cases/add-survey";
import { sign } from "jsonwebtoken";
import env from "../config/env";
import { AccountType, Header } from "../../utils/enums";

const makeAddSurveyModel = (): AddSurveyModel => ({
    question: "question",
    answers: [{ answer: "answer", image: "image" }, { answer: "answer", image: "image" }, { answer: "answer", image: "image" }],
    date: new Date(),
})

describe("SurveyRoutes", () => {
    beforeAll(async () => await MongodbHelper.connect());
    afterAll(async () => await MongodbHelper.disconnect());

    it(`Should return code ${StatusCode.ClientErrorForbidden} when POST in /api/surveys was called without accessToken`, async () => {
        await request(app).post("/api/surveys")
                          .send(makeAddSurveyModel())
                          .expect(StatusCode.ClientErrorForbidden);
    });

    it(`Should return code ${StatusCode.SuccessNoContent} when POST in /api/surveys was called with a valid accessToken`, async () => {
        const accountsCollection = await MongodbHelper.collection("accounts");

        await accountsCollection.deleteMany({});

        const { insertedId } = await accountsCollection.insertOne({ name: "joao", email: "joao@gmail.com", password: "12345678", role: AccountType.ADMIN })
        const accessToken = sign({ id: insertedId }, env.JWT_SECRET)

        await accountsCollection.updateOne({ _id: insertedId }, { $set: { accessToken } })

        await request(app).post("/api/surveys")
                          .set(Header.X_ACCESS_TOKEN, accessToken)
                          .send(makeAddSurveyModel())
                          .expect(StatusCode.SuccessNoContent)
    })
});
