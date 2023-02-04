import { DbSaveSurveyResult, SaveSurveyResultRepository } from "./db-save-survey-result-protocols";
import * as MockDate from "mockdate";
import { mockLoadSurveyResultRepository, mockSaveSurveyResultParams, mockSaveSurveyResultRepository, mockSurveyResultModel, throwError } from "@/utils/tests";
import { LoadSurveyResultRepository } from "@/data/protocols/db/survey-result/load-survey-result-repository";

let dbSaveSurveyResult: DbSaveSurveyResult
let saveSurveyResultRepositoryStub: SaveSurveyResultRepository
let loadSurveyResultRepositoryStub: LoadSurveyResultRepository

describe(DbSaveSurveyResult.name, () => {
    beforeAll(() => MockDate.set(new Date()))
    afterAll(() => MockDate.reset())

    beforeEach(() => {
        saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository()
        loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository()
        dbSaveSurveyResult = new DbSaveSurveyResult(saveSurveyResultRepositoryStub, loadSurveyResultRepositoryStub)
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

    it("Should call LoadSurveyResultRepository with correct values", async () => {
        const data = mockSaveSurveyResultParams()
        const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepositoryStub, "loadBySurveyId")

        await dbSaveSurveyResult.save(data)

        expect(loadBySurveyIdSpy).toBeCalledWith(data.surveyId)
    })

    it("Should throw if LoadSurveyResultRepository throws", async () => {
        jest.spyOn(loadSurveyResultRepositoryStub, "loadBySurveyId").mockImplementationOnce(throwError)

        const promise = dbSaveSurveyResult.save(mockSaveSurveyResultParams())

        await expect(promise).rejects.toThrow()
    })

    it("Should return a survey result when SaveSurveyResultRepository gives success", async () => {
        const surveyData = mockSaveSurveyResultParams()
        const { surveyId, date } = surveyData
        const survey = await dbSaveSurveyResult.save(surveyData)
        const { question, answers } = mockSurveyResultModel("surveyId")

        expect(survey).toEqual({ surveyId, date, question, answers })
    })
})
