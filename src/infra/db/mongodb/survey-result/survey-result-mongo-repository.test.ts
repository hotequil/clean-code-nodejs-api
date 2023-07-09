import { SurveyResultMongoRepository } from "@/infra/db/mongodb/survey-result/survey-result-mongo-repository";
import { MongodbHelper } from "@/infra/db/mongodb/helpers";
import { type Collection, type ObjectId } from "mongodb";
import * as MockDate from "mockdate";
import { type SurveyResultModel } from "@/domain/models/survey-result";
import { mockAddAccountParams, mockAddSurveyParams } from "@/utils/tests";

let repository: SurveyResultMongoRepository
let collection: Collection
let surveysCollection: Collection
let accountsCollection: Collection
const FIRST_ANSWER = "first-answer"
const SECOND_ANSWER = "second-answer"

const mockSurveyId = async (): Promise<ObjectId> => {
    const { insertedId } = await surveysCollection.insertOne(mockAddSurveyParams(FIRST_ANSWER, SECOND_ANSWER))

    return insertedId
}

const mockAccountId = async (): Promise<ObjectId> => {
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

    describe("save()", () => {
        it("Should add a survey result if it's new", async () => {
            const surveyId = await mockSurveyId()
            const accountId = await mockAccountId()

            await repository.save({ surveyId, accountId, answer: FIRST_ANSWER, date: new Date() })

            const result = await collection.findOne({ surveyId, accountId })

            expect(result).toBeTruthy()
            expect(result?._id).toBeTruthy()
        })

        it("Should update survey result if it isn't new", async () => {
            const surveyId = await mockSurveyId()
            const accountId = await mockAccountId()

            await collection.insertOne({ surveyId, accountId, answer: FIRST_ANSWER, date: new Date() })
            await repository.save({ surveyId, accountId, answer: SECOND_ANSWER, date: new Date() })

            const result = await collection.find({ surveyId, accountId }).toArray()

            expect(result).toBeTruthy()
            expect(result.length).toBe(1)
        })
    })

    describe("loadBySurveyId()", () => {
        it("Should return survey result model when loadBySurveyId was called with success", async () => {
            const surveyId = await mockSurveyId()
            const accountId = await mockAccountId()
            const otherAccountId = await mockAccountId()

            await collection.insertMany([
                { surveyId, accountId, answer: FIRST_ANSWER, date: new Date() },
                { surveyId, accountId, answer: FIRST_ANSWER, date: new Date() },
                { surveyId, accountId, answer: FIRST_ANSWER, date: new Date() },
                { surveyId, otherAccountId, answer: SECOND_ANSWER, date: new Date() },
                { surveyId, otherAccountId, answer: SECOND_ANSWER, date: new Date() }
            ])

            const result = await repository.loadBySurveyId(surveyId, accountId) as SurveyResultModel
            const [firstAnswer, secondAnswer] = result.answers

            expect(result).toBeTruthy()
            expect(result.question).toBeTruthy()
            expect(result.surveyId).toEqual(surveyId)
            expect(firstAnswer.isCurrentAccountAnswer).toBe(true)
            expect(firstAnswer.answer).toBe(FIRST_ANSWER)
            expect(firstAnswer.count).toBe(3)
            expect(firstAnswer.percent).toBe(60)
            expect(secondAnswer.isCurrentAccountAnswer).toBe(false)
            expect(secondAnswer.answer).toBe(SECOND_ANSWER)
            expect(secondAnswer.count).toBe(2)
            expect(secondAnswer.percent).toBe(40)
            expect(result.date).toBeTruthy()
        })

        it("Should return null when loadBySurveyId was called with invalid surveyId", async () => {
            jest.spyOn(repository, "loadBySurveyId").mockReturnValueOnce(Promise.resolve(null))

            const accountId = await mockAccountId()
            const result = await repository.loadBySurveyId("other-survey-id", accountId)

            expect(result).toBeNull()
        })
    })
})
