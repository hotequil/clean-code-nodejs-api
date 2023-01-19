import request from "supertest";
import StatusCode from "status-code-enum";
import app from "../config/app";
import { MongodbHelper } from "@/infra/db/mongodb/helpers/mongodb-helper";
import { Header } from "@/utils/enums";
import { sign } from "jsonwebtoken";
import env from "@/main/config/env";

const ANSWER = "answer"

const makeFakeData = (): { answer: string } => ({ answer: ANSWER })

const makeAccessToken = async (): Promise<string> => {
    const collection = await MongodbHelper.collection("accounts");

    await collection.deleteMany({});

    const { insertedId: id } = await collection.insertOne({ name: "user", email: "user@email.com", password: "user1234" })
    const accessToken = sign({ id }, env.JWT_SECRET)

    await collection.updateOne({ _id: id }, { $set: { accessToken } })

    return accessToken
}

const makeSurveyId = async (): Promise<string> => {
    const collection = await MongodbHelper.collection("surveys")

    await collection.deleteMany({})

    const { insertedId } = await collection.insertOne({
        question: "question",
        answers: [{ answer: ANSWER, image: "image" }],
        date: new Date(),
    })

    return insertedId.toJSON()
}

describe("SurveyResultRoutes", () => {
    beforeAll(async () => {
        await MongodbHelper.connect()
    });

    afterAll(async () => {
        await MongodbHelper.disconnect()
    });

    describe("PUT: /api/surveys/:surveyId/results", () => {
        it(`Should return code ${StatusCode.ClientErrorForbidden} when PUT in /api/surveys/:surveyId/results was called without accessToken`, async () => {
            await request(app).put("/api/surveys/1/results")
                              .send(makeFakeData())
                              .expect(StatusCode.ClientErrorForbidden);
        })

        it(`Should return code ${StatusCode.SuccessOK} when PUT in /api/surveys/:surveyId/results was called with a valid accessToken`, async () => {
            await request(app).put(`/api/surveys/${await makeSurveyId()}/results`)
                              .set(Header.X_ACCESS_TOKEN, await makeAccessToken())
                              .send(makeFakeData())
                              .expect(StatusCode.SuccessOK);
        })
    })
});
