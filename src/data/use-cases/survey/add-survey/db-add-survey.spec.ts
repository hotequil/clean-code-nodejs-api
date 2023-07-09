import { DbAddSurvey } from "./db-add-survey";
import { type AddSurveyRepository } from "./db-add-survey-protocols";
import { mockAddSurveyParams, mockAddSurveyRepository, throwError } from "@/utils/tests";

let db: DbAddSurvey
let addSurveyRepositoryStub: AddSurveyRepository

describe(DbAddSurvey.name, () => {
    beforeEach(() => {
        addSurveyRepositoryStub = mockAddSurveyRepository()
        db = new DbAddSurvey(addSurveyRepositoryStub)
    })

    it("Should call AddSurveyRepository with correct values", async () => {
        const repositorySpy = jest.spyOn(addSurveyRepositoryStub, "add")
        const model = mockAddSurveyParams()

        await db.add(model)

        expect(repositorySpy).toHaveBeenCalledWith(model)
    })

    it("Should throw if AddSurveyRepository throws", async () => {
        jest.spyOn(addSurveyRepositoryStub, "add").mockImplementationOnce(throwError)

        const promise = db.add(mockAddSurveyParams())

        await expect(promise).rejects.toThrow()
    })
})
