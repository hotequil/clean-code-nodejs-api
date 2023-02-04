import request from "supertest";
import StatusCode from "status-code-enum";
import app from "../config/app";
import { MongodbHelper } from "@/infra/db/mongodb/helpers";
import { Header } from "@/utils/enums";
import { sign } from "jsonwebtoken";
import env from "@/main/config/env";
import { mockAddAccountParams, mockAddSurveyParams } from "@/utils/tests";

const ANSWER = "answer"
const mockData = (): { answer: string } => ({ answer: ANSWER })

const mockAccessToken = async (): Promise<string> => {
    const collection = await MongodbHelper.collection("accounts");

    await collection.deleteMany({});

    const { insertedId: id } = await collection.insertOne(mockAddAccountParams())
    const accessToken = sign({ id }, env.JWT_SECRET)

    await collection.updateOne({ _id: id }, { $set: { accessToken } })

    return accessToken
}

const mockSurveyId = async (): Promise<string> => {
    const collection = await MongodbHelper.collection("surveys")

    await collection.deleteMany({})

    const { insertedId } = await collection.insertOne(mockAddSurveyParams(ANSWER))

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
                              .send(mockData())
                              .expect(StatusCode.ClientErrorForbidden);
        })

        it(`Should return code ${StatusCode.SuccessOK} when PUT in /api/surveys/:surveyId/results was called with a valid accessToken`, async () => {
            await request(app).put(`/api/surveys/${await mockSurveyId()}/results`)
                              .set(Header.X_ACCESS_TOKEN, await mockAccessToken())
                              .send(mockData())
                              .expect(StatusCode.SuccessOK);
        })
    })

    describe("GET: /api/surveys/:surveyId/results", () => {
        it(`Should return code ${StatusCode.ClientErrorForbidden} when GET in /api/surveys/:surveyId/results was called without accessToken`, async () => {
            await request(app).get("/api/surveys/1/results")
                              .expect(StatusCode.ClientErrorForbidden);
        })
    })
});
