import { DbLoadAnswersBySurvey, type LoadAnswersBySurveyRepository } from "./db-load-answers-by-survey-protocols";
import { mockAnswers, mockLoadAnswersBySurvey, throwError } from "@/utils/tests";

let dbLoadAnswersBySurvey: DbLoadAnswersBySurvey
let loadAnswersBySurveyRepositoryStub: LoadAnswersBySurveyRepository
const id = "id"

describe(DbLoadAnswersBySurvey.name, () => {
    beforeEach(() => {
        loadAnswersBySurveyRepositoryStub = mockLoadAnswersBySurvey(id)
        dbLoadAnswersBySurvey = new DbLoadAnswersBySurvey(loadAnswersBySurveyRepositoryStub)
    })

    it("Should call LoadAnswersBySurveyRepository with correct values", async () => {
        const loadAnswersSpy = jest.spyOn(loadAnswersBySurveyRepositoryStub, "loadAnswers")

        await dbLoadAnswersBySurvey.loadAnswers(id)

        expect(loadAnswersSpy).toBeCalledWith(id)
    })

    it("Should return answers when loadAnswers was called with success", async () => {
        const answers = await dbLoadAnswersBySurvey.loadAnswers(id)

        expect(answers).toEqual(mockAnswers(id))
    })

    it("Should return an empty array when LoadAnswersBySurveyRepository returns an empty array", async () => {
        jest.spyOn(loadAnswersBySurveyRepositoryStub, "loadAnswers").mockReturnValueOnce(Promise.resolve([]))

        const answers = await dbLoadAnswersBySurvey.loadAnswers(id)

        expect(answers).toEqual([])
    })

    it("Should throw if LoadAnswersBySurveyRepository throws", async () => {
        jest.spyOn(loadAnswersBySurveyRepositoryStub, "loadAnswers").mockImplementationOnce(throwError)

        const promise = dbLoadAnswersBySurvey.loadAnswers(id)

        await expect(promise).rejects.toThrow()
    })
})
