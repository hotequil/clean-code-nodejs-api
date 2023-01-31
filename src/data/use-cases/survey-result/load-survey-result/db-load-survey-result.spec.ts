import { DbLoadSurveyResult } from "./db-load-survey-result";
import { LoadSurveyResultRepository } from "./db-load-survey-result-protocols";
import { mockLoadSurveyResultRepository, throwError } from "@/utils/tests";

let db: DbLoadSurveyResult
let loadSurveyResultRepositoryStub: LoadSurveyResultRepository
const SURVEY_ID = "survey-id"

describe(DbLoadSurveyResult.name, () => {
    beforeEach(() => {
        loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository()
        db = new DbLoadSurveyResult(loadSurveyResultRepositoryStub)
    })

    it("Should call LoadSurveyResultRepository with correct values", async () => {
        const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepositoryStub, "loadBySurveyId")

        await db.load(SURVEY_ID)

        expect(loadBySurveyIdSpy).toBeCalledWith(SURVEY_ID)
    })

    it("Should throw if LoadSurveyResultRepository throws", async () => {
        jest.spyOn(loadSurveyResultRepositoryStub, "loadBySurveyId").mockImplementationOnce(throwError)

        const promise = db.load(SURVEY_ID)

        await expect(promise).rejects.toThrow()
    })
})
