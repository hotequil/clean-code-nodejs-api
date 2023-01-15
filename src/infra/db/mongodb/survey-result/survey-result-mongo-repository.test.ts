import { SurveyResultMongoRepository } from "@/infra/db/mongodb/survey-result/survey-result-mongo-repository";
import { MongodbHelper } from "@/infra/db/mongodb/helpers/mongodb-helper";
import { Collection } from "mongodb";
import * as MockDate from "mockdate";
import { SurveyResultModel } from "@/domain/models/survey-result";

let repository: SurveyResultMongoRepository
let collection: Collection
let surveysCollection: Collection
let accountsCollection: Collection

const makeSurveyId = async (): Promise<Object> => {
    const { insertedId } = await surveysCollection.insertOne({
        question: "question",
        answers: [{ answer: "answer", image: "image" }],
        date: new Date(),
    })

    return insertedId
}

const makeAccountId = async (): Promise<Object> => {
    const { insertedId } = await accountsCollection.insertOne({
        name: "name",
        email: "email@email.email",
        password: "password"
    })

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
        const surveyId = await makeSurveyId()
        const accountId = await makeAccountId()
        const answer = "answer"
        const result = await repository.save({ surveyId, accountId, answer, date: new Date() }) as SurveyResultModel

        expect(result.id).toBeTruthy()
        expect(result.surveyId).toEqual(surveyId)
        expect(result.accountId).toEqual(accountId)
        expect(result.answer).toBe(answer)
        expect(result.date).toBeTruthy()
    })
})
