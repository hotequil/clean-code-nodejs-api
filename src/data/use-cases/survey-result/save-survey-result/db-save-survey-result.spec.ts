import { DbSaveSurveyResult, SaveSurveyResultRepository } from "./db-save-survey-result-protocols";
import * as MockDate from "mockdate";
import { mockSaveSurveyResultParams, mockSaveSurveyResultRepository, throwError } from "@/utils/tests";

let dbSaveSurveyResult: DbSaveSurveyResult
let saveSurveyResultRepositoryStub: SaveSurveyResultRepository
const SURVEY_ID = "id"

describe(DbSaveSurveyResult.name, () => {
    beforeAll(() => MockDate.set(new Date()))
    afterAll(() => MockDate.reset())

    beforeEach(() => {
        saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository(SURVEY_ID)
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
        const survey = await dbSaveSurveyResult.save(surveyData)

        expect(survey).toEqual({ ...surveyData, id: SURVEY_ID })
    })
})
