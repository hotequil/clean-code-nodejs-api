import { SurveyMongoRepository } from "./survey-mongo-repository";
import { MongodbHelper } from "../helpers";
import { Collection } from "mongodb";
import { SurveyModel } from "@/domain/models/survey";
import * as MockDate from "mockdate";
import { mockAddSurveyParams } from "@/utils/tests";

let repository: SurveyMongoRepository
let collection: Collection

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

        await collection.deleteMany({});

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
        it("Should get all surveys when loadAll was called", async () => {
            const surveysToAdd = [mockAddSurveyParams(), mockAddSurveyParams()]

            await collection.insertMany(surveysToAdd)

            const surveys = await repository.loadAll()

            expect(surveys.length).toBe(surveysToAdd.length)
            expect(surveys[0].question).toBe(surveysToAdd[0].question)
        })

        it("Should get an empty list of surveys when loadAll was called", async () => {
            const surveys = await repository.loadAll()

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

        it("Should return null if id is invalid", async () => {
            const survey = await repository.loadById("6348acd2e1a47ca32e79f46f")

            expect(survey).toBeNull()
        })
    })
})
