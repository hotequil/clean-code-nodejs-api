import { Collection } from "mongodb";
import { MongodbHelper } from "@/infra/db/mongodb/helpers";
import { Express } from "express";
import request from "supertest";
import { makeApp } from "@/main/graphql/tests/helper";
import StatusCode from "status-code-enum";
import { mockAccessToken, mockAddSurveyParams } from "@/utils/tests";
import { Header } from "@/utils/enums";

const route = "/graphql"

describe("SurveyResult GraphQL", () => {
    let collection: Collection;
    let surveysCollection: Collection;
    let app: Express

    beforeAll(async () => {
        await MongodbHelper.connect()

        app = await makeApp()
    });

    afterAll(async () => {
        await MongodbHelper.disconnect()
    });

    beforeEach(async () => {
        collection = await MongodbHelper.collection("surveyResults");
        surveysCollection = await MongodbHelper.collection("surveys");

        await collection.deleteMany({});
        await surveysCollection.deleteMany({});
    });

    describe("SurveyResult Query", () => {
        const query = `
            query surveyResult($surveyId: String!){
                surveyResult(surveyId: $surveyId){
                    surveyId
                    question
                    answers{
                        answer
                        count
                        percent
                        isCurrentAccountAnswer
                        image
                    }
                    date
                }
            }
        `

        it(`Should return survey results on success (${StatusCode.SuccessOK}) query`, async () => {
            const survey = mockAddSurveyParams()
            const { insertedId: surveyId } = await surveysCollection.insertOne(survey)
            const { body, statusCode } = await request(app).post(route)
                                                           .set(Header.X_ACCESS_TOKEN, await mockAccessToken())
                                                           .send({ query, variables: { surveyId } });

            const { surveyResult } = body.data

            expect(surveyResult.surveyId).toBe(surveyId.toJSON())
            expect(surveyResult.question).toBe(survey.question)
            expect(surveyResult.answers[0].answer).toBe(survey.answers[0].answer)
            expect(surveyResult.answers[0].image).toBe(null)
            expect(surveyResult.answers[0].percent).toBe(0)
            expect(surveyResult.answers[0].count).toBe(0)
            expect(surveyResult.answers[0].isCurrentAccountAnswer).toBe(false)
            expect(surveyResult.answers[1].answer).toBe(survey.answers[1].answer)
            expect(surveyResult.answers[1].image).toBe(survey.answers[1].image)
            expect(surveyResult.answers[1].percent).toBe(0)
            expect(surveyResult.answers[1].count).toBe(0)
            expect(surveyResult.answers[1].isCurrentAccountAnswer).toBe(false)
            expect(new Date(surveyResult.date).toLocaleDateString()).toBe(survey.date.toLocaleDateString())
            expect(statusCode).toBe(StatusCode.SuccessOK)
        })

        it(`Should return status code ${StatusCode.ClientErrorForbidden} (forbidden error) on request if there isn't access token`, async () => {
            const survey = mockAddSurveyParams()
            const { insertedId: surveyId } = await surveysCollection.insertOne(survey)
            const { body, statusCode } = await request(app).post(route).send({ query, variables: { surveyId } })

            expect(body.data).toBe(null)
            expect(statusCode).toBe(StatusCode.ClientErrorForbidden)
        })
    });
})
