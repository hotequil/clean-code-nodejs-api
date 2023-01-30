import { SurveyResultMongoRepository } from "@/infra/db/mongodb/survey-result/survey-result-mongo-repository";
import { MongodbHelper } from "@/infra/db/mongodb/helpers";
import { Collection } from "mongodb";
import * as MockDate from "mockdate";
import { SurveyResultModel } from "@/domain/models/survey-result";
import { mockAddAccountParams, mockAddSurveyParams } from "@/utils/tests";

let repository: SurveyResultMongoRepository
let collection: Collection
let surveysCollection: Collection
let accountsCollection: Collection
const FIRST_ANSWER = "first-answer"
const SECOND_ANSWER = "second-answer"

const mockSurveyId = async (): Promise<Object> => {
    const { insertedId } = await surveysCollection.insertOne(mockAddSurveyParams(FIRST_ANSWER, SECOND_ANSWER))

    return insertedId
}

const mockAccountId = async (): Promise<Object> => {
    const { insertedId } = await accountsCollection.insertOne(mockAddAccountParams())

    return insertedId
}

describe(SurveyResultMongoRepository.name, () => {
    beforeAll(async () => {
        await MongodbHelper.connect()

        MockDate.set(new Date())
    })

    afterAll(async () => {
        await MongodbHelper.disconnect()

        MockDate.reset()
    })

    beforeEach(async () => {
        repository = new SurveyResultMongoRepository()
        collection = await MongodbHelper.collection("surveyResults")
        surveysCollection = await MongodbHelper.collection("surveys")
        accountsCollection = await MongodbHelper.collection("accounts")

        await collection.deleteMany({})
        await surveysCollection.deleteMany({})
        await accountsCollection.deleteMany({})
    })

    it("Should add a survey result if it's new", async () => {
        const surveyId = await mockSurveyId()
        const accountId = await mockAccountId()
        const result = await repository.save({ surveyId, accountId, answer: FIRST_ANSWER, date: new Date() }) as SurveyResultModel
        const [firstAnswer, secondAnswer] = result.answers

        expect(result).toBeTruthy()
        expect(result.question).toBeTruthy()
        expect(result.surveyId).toEqual(surveyId)
        expect(firstAnswer.answer).toBe(FIRST_ANSWER)
        expect(firstAnswer.count).toBe(1)
        expect(firstAnswer.percent).toBe(100)
        expect(secondAnswer.answer).toBe(SECOND_ANSWER)
        expect(secondAnswer.count).toBe(0)
        expect(secondAnswer.percent).toBe(0)
        expect(result.date).toBeTruthy()
    })

    it("Should update survey result if it isn't new", async () => {
        const surveyId = await mockSurveyId()
        const accountId = await mockAccountId()

        await collection.insertOne({ surveyId, accountId, answer: FIRST_ANSWER, date: new Date() })

        const result = await repository.save({ surveyId, accountId, answer: SECOND_ANSWER, date: new Date() }) as SurveyResultModel
        const [first, second] = result.answers

        expect(result).toBeTruthy()
        expect(result.question).toBeTruthy()
        expect(result.surveyId).toEqual(surveyId)
        expect(first.answer).toBe(SECOND_ANSWER)
        expect(first.count).toBe(1)
        expect(first.percent).toBe(100)
        expect(second.answer).toBe(FIRST_ANSWER)
        expect(second.count).toBe(0)
        expect(second.percent).toBe(0)
        expect(result.date).toBeTruthy()
    })
})
