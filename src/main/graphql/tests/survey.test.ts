import { Collection } from "mongodb";
import { MongodbHelper } from "@/infra/db/mongodb/helpers";
import { Express } from "express";
import request from "supertest";
import { makeApp } from "@/main/graphql/tests/helper";
import StatusCode from "status-code-enum";
import { mockAccessToken, mockAddSurveyParams } from "@/utils/tests";
import { Header } from "@/utils/enums";

const route = "/graphql"

describe("Survey GraphQL", () => {
    let collection: Collection;
    let app: Express

    beforeAll(async () => {
        await MongodbHelper.connect()

        app = await makeApp()
    });

    afterAll(async () => {
        await MongodbHelper.disconnect()
    });

    beforeEach(async () => {
        collection = await MongodbHelper.collection("surveys");

        await collection.deleteMany({});
    });

    describe("Survey Query", () => {
        const query = `
            query surveys{
                surveys{
                    id
                    question
                    answers {
                        answer
                        image
                    }
                    date
                    didAnswer
                }
            }
        `

        it(`Should return surveys list on success (${StatusCode.SuccessOK}) query`, async () => {
            const survey = mockAddSurveyParams()

            await collection.insertOne(survey)

            const { body, statusCode } = await request(app).post(route)
                                                           .set(Header.X_ACCESS_TOKEN, await mockAccessToken())
                                                           .send({ query });

            const { surveys } = body.data
            const [firstSurvey] = surveys

            expect(surveys.length).toBe(1)
            expect(firstSurvey.id).toBeTruthy()
            expect(firstSurvey.question).toBe(survey.question)
            expect(firstSurvey.answers.length).toBe(survey.answers.length)
            expect(firstSurvey.date).toBeTruthy()
            expect(firstSurvey.didAnswer).toEqual(!!survey.didAnswer)
            expect(statusCode).toBe(StatusCode.SuccessOK)
        })

        it(`Should return an error (${StatusCode.ClientErrorForbidden}) on query if there is no access token`, async () => {
            const { body, statusCode } = await request(app).post(route).send({ query });

            expect(body.data).toBe(null)
            expect(statusCode).toBe(StatusCode.ClientErrorForbidden)
        })
    });
})
