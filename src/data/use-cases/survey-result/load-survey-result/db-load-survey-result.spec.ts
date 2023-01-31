import { DbLoadSurveyResult } from "./db-load-survey-result";
import { LoadSurveyResultRepository } from "./db-load-survey-result-protocols";
import { mockLoadSurveyResultRepository, mockSurveyResultModel, throwError } from "@/utils/tests";
import MockDate from "mockdate";

let db: DbLoadSurveyResult
let loadSurveyResultRepositoryStub: LoadSurveyResultRepository
const SURVEY_ID = "survey-id"

describe(DbLoadSurveyResult.name, () => {
    beforeAll(() => MockDate.set(new Date()))
    afterAll(() => MockDate.reset())

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

    it("Should return survey result model when load was called with success", async () => {
        const result = await db.load(SURVEY_ID)

        expect(result).toEqual(mockSurveyResultModel(SURVEY_ID))
    })
})
