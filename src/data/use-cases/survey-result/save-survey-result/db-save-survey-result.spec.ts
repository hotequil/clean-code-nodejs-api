import { DbSaveSurveyResult, SaveSurveyResultRepository, SurveyAnswersResultModel } from "./db-save-survey-result-protocols";
import * as MockDate from "mockdate";
import { mockSaveSurveyResultParams, mockSaveSurveyResultRepository, throwError } from "@/utils/tests";

let dbSaveSurveyResult: DbSaveSurveyResult
let saveSurveyResultRepositoryStub: SaveSurveyResultRepository
const QUESTION = "question"
const ANSWERS: SurveyAnswersResultModel = []

describe(DbSaveSurveyResult.name, () => {
    beforeAll(() => MockDate.set(new Date()))
    afterAll(() => MockDate.reset())

    beforeEach(() => {
        saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository(QUESTION, ANSWERS)
        dbSaveSurveyResult = new DbSaveSurveyResult(saveSurveyResultRepositoryStub)
    })

    it("Should call SaveSurveyResultRepository with correct values", async () => {
        const data = mockSaveSurveyResultParams()
        const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, "save")

        await dbSaveSurveyResult.save(data)

        expect(saveSpy).toBeCalledWith(data)
    })

    it("Should throw if SaveSurveyResultRepository throws", async () => {
        jest.spyOn(saveSurveyResultRepositoryStub, "save").mockImplementationOnce(throwError)

        const promise = dbSaveSurveyResult.save(mockSaveSurveyResultParams())

        await expect(promise).rejects.toThrow()
    })

    it("Should return a survey result when SaveSurveyResultRepository gives success", async () => {
        const surveyData = mockSaveSurveyResultParams()
        const { surveyId, date } = surveyData
        const survey = await dbSaveSurveyResult.save(surveyData)

        expect(survey).toEqual({ surveyId, date, question: QUESTION, answers: ANSWERS })
    })
})
