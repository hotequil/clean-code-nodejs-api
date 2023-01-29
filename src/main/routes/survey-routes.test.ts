import request from "supertest";
import StatusCode from "status-code-enum";
import app from "../config/app";
import { MongodbHelper } from "@/infra/db/mongodb/helpers";
import { sign } from "jsonwebtoken";
import env from "../config/env";
import { AccountType, Header } from "@/utils/enums";
import { mockAddAccountParams, mockAddSurveyParams } from "@/utils/tests";

const mockAccessToken = async (role?: AccountType): Promise<string> => {
    const collection = await MongodbHelper.collection("accounts");

    await collection.deleteMany({});

    const { insertedId } = await collection.insertOne({ ...mockAddAccountParams(), role })
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
                              .send(mockAddSurveyParams())
                              .expect(StatusCode.ClientErrorForbidden);
        });

        it(`Should return code ${StatusCode.SuccessNoContent} when POST in /api/surveys was called with a valid accessToken`, async () => {
            await request(app).post("/api/surveys")
                              .set(Header.X_ACCESS_TOKEN, await mockAccessToken(AccountType.ADMIN))
                              .send(mockAddSurveyParams())
                              .expect(StatusCode.SuccessNoContent)
        })
    })

    describe("GET: /api/surveys", () => {
        it(`Should return code ${StatusCode.ClientErrorForbidden} when GET in /api/surveys was called without accessToken`, async () =>
            await request(app).get("/api/surveys").expect(StatusCode.ClientErrorForbidden)
        )

        it(`Should return code ${StatusCode.SuccessOK} or ${StatusCode.SuccessNoContent} when GET in /api/surveys was called with a valid accessToken`, async () => {
            await request(app).get("/api/surveys")
                              .set(Header.X_ACCESS_TOKEN, await mockAccessToken())
                              .then(({ statusCode }) =>
                                  expect(statusCode === StatusCode.SuccessOK || statusCode === StatusCode.SuccessNoContent).toBe(true)
                              )
        })
    })
});
