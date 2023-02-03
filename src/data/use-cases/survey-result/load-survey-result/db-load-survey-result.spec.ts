import { DbLoadSurveyResult } from "./db-load-survey-result";
import { LoadSurveyResultRepository, LoadSurveyByIdRepository } from "./db-load-survey-result-protocols";
import {
    mockLoadSurveyByIdRepository,
    mockLoadSurveyResultRepository,
    mockSurveyResultModel,
    throwError
} from "@/utils/tests";
import MockDate from "mockdate";

let db: DbLoadSurveyResult
let loadSurveyResultRepositoryStub: LoadSurveyResultRepository
let loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
const SURVEY_ID = "survey-id"

describe(DbLoadSurveyResult.name, () => {
    beforeAll(() => MockDate.set(new Date()))
    afterAll(() => MockDate.reset())

    beforeEach(() => {
        loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository()
        loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository(SURVEY_ID, "other-answer")
        db = new DbLoadSurveyResult(loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub)
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

    it("Should call LoadSurveyByIdRepository if LoadSurveyResultRepository returns null", async () => {
        jest.spyOn(loadSurveyResultRepositoryStub, "loadBySurveyId").mockReturnValueOnce(Promise.resolve(null))

        const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, "loadById")

        await db.load(SURVEY_ID)

        expect(loadByIdSpy).toBeCalledWith(SURVEY_ID)
    })

    it("Should return survey result model with all reset answers when LoadSurveyResultRepository returns null", async () => {
        jest.spyOn(loadSurveyResultRepositoryStub, "loadBySurveyId").mockReturnValueOnce(Promise.resolve(null))

        const result = await db.load(SURVEY_ID)

        expect(result).toEqual(mockSurveyResultModel(SURVEY_ID, true))
    })

    it("Should return survey result model when load was called with success", async () => {
        const result = await db.load(SURVEY_ID)

        expect(result).toEqual(mockSurveyResultModel(SURVEY_ID))
    })
})
