import { SurveyMongoRepository } from "./survey-mongo-repository";
import { MongodbHelper } from "../helpers/mongodb-helper";
import { Collection } from "mongodb";
import { AddSurveyModel } from "../../../../domain/use-cases/add-survey";

let repository: SurveyMongoRepository
let collection: Collection

const makeSurveyData = (): AddSurveyModel => ({
    question: "question",
    answers: [{ answer: "answer" }, { answer: "answer", image: "image" }]
})

describe(SurveyMongoRepository.name, () => {
    beforeAll(async () => await MongodbHelper.connect())
    afterAll(async () => await MongodbHelper.disconnect())

    beforeEach(async () => {
        collection = await MongodbHelper.collection("surveys");

        await collection.deleteMany({});

        repository = new SurveyMongoRepository()
    })

    it("Should create a survey when add was called", async () => {
        const data = makeSurveyData()

        await repository.add(data)

        const addedSurvey = await collection.findOne({ question: data.question })

        expect(addedSurvey).toBeTruthy()
    })
})
