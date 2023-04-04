import { SurveyMongoRepository } from "./survey-mongo-repository";
import { MongodbHelper } from "../helpers";
import { Collection } from "mongodb";
import { SurveyModel } from "@/domain/models/survey";
import * as MockDate from "mockdate";
import { mockAddAccountParams, mockAddSurveyParams, mockSaveSurveyResultParams, MONGO_OBJECT_ID } from "@/utils/tests";

let repository: SurveyMongoRepository
let collection: Collection
let accountsCollection: Collection
let surveyResultsCollection: Collection

describe(SurveyMongoRepository.name, () => {
    beforeAll(async () => {
        await MongodbHelper.connect()

        MockDate.set(new Date())
    })

    afterAll(async () => {
        await MongodbHelper.disconnect()

        MockDate.reset()
    })

    beforeEach(async () => {
        collection = await MongodbHelper.collection("surveys");
        accountsCollection = await MongodbHelper.collection("accounts")
        surveyResultsCollection = await MongodbHelper.collection("surveyResults")

        await collection.deleteMany({});
        await accountsCollection.deleteMany({})
        await surveyResultsCollection.deleteMany({})

        repository = new SurveyMongoRepository()
    })

    describe("add()", () => {
        it("Should create a survey when add was called", async () => {
            const data = mockAddSurveyParams()

            await repository.add(data)

            const addedSurvey = await collection.findOne({ question: data.question })

            expect(addedSurvey).toBeTruthy()
        })
    })

    describe("loadAll()", () => {
        it("Should call loadAll with correct values", async () => {
            const loadAllSpy = jest.spyOn(repository, "loadAll")

            await repository.loadAll(MONGO_OBJECT_ID)

            expect(loadAllSpy).toHaveBeenCalledWith(MONGO_OBJECT_ID)
        })

        it("Should get all surveys when loadAll was called", async () => {
            const surveysToAdd = [mockAddSurveyParams(), mockAddSurveyParams()]
            const addAccountParams = mockAddAccountParams()
            const { insertedIds } = await collection.insertMany(surveysToAdd)
            const surveyId = insertedIds[0]
            const { insertedId: accountId } = await accountsCollection.insertOne(addAccountParams)

            await surveyResultsCollection.insertOne(mockSaveSurveyResultParams(surveyId, accountId))

            const surveys = await repository.loadAll(accountId)

            expect(surveys.length).toBe(surveysToAdd.length)
            expect(surveys[0].question).toBe(surveysToAdd[0].question)
            expect(surveys[0].didAnswer).toBe(true)
            expect(surveys[1].question).toBe(surveysToAdd[1].question)
            expect(surveys[1].didAnswer).toBe(false)
        })

        it("Should get an empty list of surveys when loadAll was called", async () => {
            const surveys = await repository.loadAll(MONGO_OBJECT_ID)

            expect(surveys.length).toBe(0)
        })
    })

    describe("loadById()", () => {
        it("Should load survey by id on success", async () => {
            const surveyData = mockAddSurveyParams()
            const { insertedId } = await collection.insertOne(surveyData)
            const survey = await repository.loadById(insertedId) as SurveyModel

            expect(survey.id).toEqual(insertedId)
            expect(survey.question).toBe(surveyData.question)
            expect(survey.date).toEqual(surveyData.date)
            expect(survey.answers).toEqual(surveyData.answers)
        })

        it("Should return null if survey id is invalid", async () => {
            const survey = await repository.loadById(MONGO_OBJECT_ID)

            expect(survey).toBeNull()
        })
    })

    describe("checkById()", () => {
        it("Should check survey by id on success", async () => {
            const surveyData = mockAddSurveyParams()
            const { insertedId } = await collection.insertOne(surveyData)
            const result = await repository.checkById(insertedId)

            expect(result).toBe(true)
        })

        it("Should return false if survey id is invalid", async () => {
            const result = await repository.checkById(MONGO_OBJECT_ID)

            expect(result).toBe(false)
        })
    })
})
