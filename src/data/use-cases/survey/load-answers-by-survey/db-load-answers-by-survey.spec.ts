import { DbLoadAnswersBySurvey, LoadSurveyByIdRepository } from "./db-load-answers-by-survey-protocols";
import { mockAnswers, mockLoadSurveyByIdRepository, throwError } from "@/utils/tests";

let dbLoadAnswersBySurvey: DbLoadAnswersBySurvey
let loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
const id = "id"

describe(DbLoadAnswersBySurvey.name, () => {
    beforeEach(() => {
        loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository(id)
        dbLoadAnswersBySurvey = new DbLoadAnswersBySurvey(loadSurveyByIdRepositoryStub)
    })

    it("Should call LoadSurveyByIdRepository with correct values", async () => {
        const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, "loadById")

        await dbLoadAnswersBySurvey.loadAnswers(id)

        expect(loadByIdSpy).toBeCalledWith(id)
    })

    it("Should return answers when loadAnswers was called with success", async () => {
        const answers = await dbLoadAnswersBySurvey.loadAnswers(id)

        expect(answers).toEqual(mockAnswers())
    })

    it("Should return an empty array when survey is null", async () => {
        jest.spyOn(loadSurveyByIdRepositoryStub, "loadById").mockReturnValueOnce(Promise.resolve(null))

        const answers = await dbLoadAnswersBySurvey.loadAnswers(id)

        expect(answers).toEqual([])
    })

    it("Should throw if LoadSurveyByIdRepository throws", async () => {
        jest.spyOn(loadSurveyByIdRepositoryStub, "loadById").mockImplementationOnce(throwError)

        const promise = dbLoadAnswersBySurvey.loadAnswers(id)

        await expect(promise).rejects.toThrow()
    })
})
