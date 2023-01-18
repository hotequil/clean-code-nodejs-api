import request from "supertest";
import StatusCode from "status-code-enum";
import app from "../config/app";
import { MongodbHelper } from "@/infra/db/mongodb/helpers/mongodb-helper";

const makeFakeData = (): { answer: string } => ({ answer: "answer" })

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
    })
});
