import { DbLoadSurveyResult } from "./db-load-survey-result";
import { LoadSurveyResultRepository, SurveyResultModel } from "./db-load-survey-result-protocols";
import { mockSurveyResultModel } from "@/utils/tests";

let db: DbLoadSurveyResult
let loadSurveyResultRepositoryStub: LoadSurveyResultRepository
const SURVEY_ID = "survey-id"

export class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository{
    async loadBySurveyId(surveyId: string): Promise<SurveyResultModel | null>{
        return mockSurveyResultModel(surveyId);
    }
}

describe(DbLoadSurveyResult.name, () => {
    beforeEach(() => {
        loadSurveyResultRepositoryStub = new LoadSurveyResultRepositoryStub()
        db = new DbLoadSurveyResult(loadSurveyResultRepositoryStub)
    })

    it("Should call LoadSurveyResultRepository with correct values", async () => {
        const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepositoryStub, "loadBySurveyId")

        await db.load(SURVEY_ID)

        expect(loadBySurveyIdSpy).toBeCalledWith(SURVEY_ID)
    })
})
