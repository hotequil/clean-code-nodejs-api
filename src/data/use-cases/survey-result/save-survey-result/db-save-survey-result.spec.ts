import { DbSaveSurveyResult, SaveSurveyResultParams, SurveyResultModel, SaveSurveyResultRepository } from "./db-save-survey-result-protocols";
import * as MockDate from "mockdate";

let dbSaveSurveyResult: DbSaveSurveyResult
let saveSurveyResultRepositoryStub: SaveSurveyResultRepository
const SURVEY_ID = "id"

const makeFakeSaveSurveyResultModel = (): SaveSurveyResultParams => ({
    surveyId: "surveyId",
    accountId: "accountId",
    answer: "answer",
    date: new Date(),
})

class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository{
    async save(data: SaveSurveyResultParams): Promise<SurveyResultModel | null>{
        return await new Promise(resolve => resolve({ ...data, id: SURVEY_ID }))
    }
}

describe(DbSaveSurveyResult.name, () => {
    beforeAll(() => MockDate.set(new Date()))
    afterAll(() => MockDate.reset())

    beforeEach(() => {
        saveSurveyResultRepositoryStub = new SaveSurveyResultRepositoryStub()
        dbSaveSurveyResult = new DbSaveSurveyResult(saveSurveyResultRepositoryStub)
    })

    it("Should call SaveSurveyResultRepository with correct values", async () => {
        const data = makeFakeSaveSurveyResultModel()
        const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, "save")

        await dbSaveSurveyResult.save(data)

        expect(saveSpy).toBeCalledWith(data)
    })

    it("Should throw if SaveSurveyResultRepository throws", async () => {
        jest.spyOn(saveSurveyResultRepositoryStub, "save").mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

        const promise = dbSaveSurveyResult.save(makeFakeSaveSurveyResultModel())

        await expect(promise).rejects.toThrow()
    })

    it("Should return a survey result when SaveSurveyResultRepository gives success", async () => {
        const surveyData = makeFakeSaveSurveyResultModel()
        const survey = await dbSaveSurveyResult.save(surveyData)

        expect(survey).toEqual({ ...surveyData, id: SURVEY_ID })
    })
})
