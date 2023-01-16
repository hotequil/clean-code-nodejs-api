import request from "supertest";
import StatusCode from "status-code-enum";
import app from "../config/app";
import { MongodbHelper } from "@/infra/db/mongodb/helpers/mongodb-helper";
import { AddSurveyModel } from "@/domain/use-cases/survey/add-survey";
import { sign } from "jsonwebtoken";
import env from "../config/env";
import { AccountType, Header } from "@/utils/enums";

const makeAddSurveyModel = (): AddSurveyModel => ({
    question: "question",
    answers: [{ answer: "answer", image: "image" }, { answer: "answer", image: "image" }, { answer: "answer", image: "image" }],
    date: new Date(),
})

const makeAccessToken = async (role?: AccountType): Promise<string> => {
    const collection = await MongodbHelper.collection("accounts");

    await collection.deleteMany({});

    const { insertedId } = await collection.insertOne({ name: "joao", email: "joao@gmail.com", password: "12345678", role })
    const accessToken = sign({ id: insertedId }, env.JWT_SECRET)

    await collection.updateOne({ _id: insertedId }, { $set: { accessToken } })

    return accessToken
}

describe("SurveyRoutes", () => {
    beforeAll(async () => {
        await MongodbHelper.connect()
    });

    afterAll(async () => {
        await MongodbHelper.disconnect()
    });

    describe("POST: /api/surveys", () => {
        it(`Should return code ${StatusCode.ClientErrorForbidden} when POST in /api/surveys was called without accessToken`, async () => {
            await request(app).post("/api/surveys")
                              .send(makeAddSurveyModel())
                              .expect(StatusCode.ClientErrorForbidden);
        });

        it(`Should return code ${StatusCode.SuccessNoContent} when POST in /api/surveys was called with a valid accessToken`, async () => {
            await request(app).post("/api/surveys")
                              .set(Header.X_ACCESS_TOKEN, await makeAccessToken(AccountType.ADMIN))
                              .send(makeAddSurveyModel())
                              .expect(StatusCode.SuccessNoContent)
        })
    })

    describe("GET: /api/surveys", () => {
        it(`Should return code ${StatusCode.ClientErrorForbidden} when GET in /api/surveys was called without accessToken`, async () =>
            await request(app).get("/api/surveys").expect(StatusCode.ClientErrorForbidden)
        )

        it(`Should return code ${StatusCode.SuccessOK} or ${StatusCode.SuccessNoContent} when GET in /api/surveys was called with a valid accessToken`, async () => {
            await request(app).get("/api/surveys")
                              .set(Header.X_ACCESS_TOKEN, await makeAccessToken())
                              .then(({ statusCode }) =>
                                  expect(statusCode === StatusCode.SuccessOK || statusCode === StatusCode.SuccessNoContent).toBe(true)
                              )
        })
    })
});
