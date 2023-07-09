import { DbLoadSurveys } from "./db-load-surveys";
import { type LoadSurveysRepository } from "./db-load-surveys-protocols";
import * as MockDate from "mockdate";
import { mockLoadSurveysRepository, mockSurveysModel, throwError } from "@/utils/tests";

let loadSurveys: DbLoadSurveys
let loadSurveysRepositoryStub: LoadSurveysRepository
const ACCOUNT_ID = "id"

describe(DbLoadSurveys.name, () => {
    beforeAll(() => { MockDate.set(new Date()); })
    afterAll(() => { MockDate.reset(); })

    beforeEach(() => {
        loadSurveysRepositoryStub = mockLoadSurveysRepository()
        loadSurveys = new DbLoadSurveys(loadSurveysRepositoryStub)
    })

    it("Should call load with correct values", async () => {
        const loadSpy = jest.spyOn(loadSurveys, "load")

        await loadSurveys.load(ACCOUNT_ID)

        expect(loadSpy).toHaveBeenCalledWith(ACCOUNT_ID)
    })

    it("Should call LoadSurveysRepository when load was called", async () => {
        const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub, "loadAll")

        await loadSurveys.load(ACCOUNT_ID)

        expect(loadAllSpy).toHaveBeenCalledWith(ACCOUNT_ID)
    })

    it("Should return a list of surveys on success", async () => {
        const surveys = await loadSurveys.load(ACCOUNT_ID)

        expect(surveys).toEqual(mockSurveysModel())
    })

    it("Should throw if LoadSurveysRepository throws", async () => {
        jest.spyOn(loadSurveysRepositoryStub, "loadAll").mockImplementationOnce(throwError)

        const promise = loadSurveys.load(ACCOUNT_ID)

        await expect(promise).rejects.toThrow()
    })
})
