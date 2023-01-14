import { DbSaveSurveyResult, SaveSurveyResultModel, SurveyResultModel, SaveSurveyResultRepository } from "./db-save-survey-result-protocols";
import * as MockDate from "mockdate";

let dbSaveSurveyResult: DbSaveSurveyResult
let saveSurveyResultRepositoryStub: SaveSurveyResultRepository
const SURVEY_ID = "id"

const makeFakeSaveSurveyResultModel = (): SaveSurveyResultModel => ({
    surveyId: "surveyId",
    accountId: "accountId",
    answer: "answer",
    date: new Date(),
})

class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository{
    async save(data: SaveSurveyResultModel): Promise<SurveyResultModel | null>{
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
})
