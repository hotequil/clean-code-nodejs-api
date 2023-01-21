import { DbAddSurvey } from "./db-add-survey";
import { AddSurveyParams, AddSurveyRepository } from "./db-add-survey-protocols";
import { mockAddSurveyRepository, throwError } from "@/utils/tests";

let db: DbAddSurvey
let addSurveyRepositoryStub: AddSurveyRepository

const makeAddSurveyModel = (): AddSurveyParams => ({
    question: "question",
    answers: [
        { image: "image", answer: "answer" },
        { image: "image", answer: "answer" },
        { image: "image", answer: "answer" },
    ],
    date: new Date(),
})

describe(DbAddSurvey.name, () => {
    beforeEach(() => {
        addSurveyRepositoryStub = mockAddSurveyRepository()
        db = new DbAddSurvey(addSurveyRepositoryStub)
    })

    it("Should call AddSurveyRepository with correct values", async () => {
        const repositorySpy = jest.spyOn(addSurveyRepositoryStub, "add")
        const model = makeAddSurveyModel()

        await db.add(model)

        expect(repositorySpy).toHaveBeenCalledWith(model)
    })

    it("Should throw if AddSurveyRepository throws", async () => {
        jest.spyOn(addSurveyRepositoryStub, "add").mockImplementationOnce(throwError)

        const promise = db.add(makeAddSurveyModel())

        await expect(promise).rejects.toThrow()
    })
})
