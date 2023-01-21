import { DbLoadSurveys } from "./db-load-surveys";
import { LoadSurveysRepository } from "./db-load-surveys-protocols";
import * as MockDate from "mockdate";
import { mockLoadSurveysRepository, mockSurveysModel, throwError } from "@/utils/tests";

let loadSurveys: DbLoadSurveys
let loadSurveysRepositoryStub: LoadSurveysRepository

describe(DbLoadSurveys.name, () => {
    beforeAll(() => MockDate.set(new Date()))
    afterAll(() => MockDate.reset())

    beforeEach(() => {
        loadSurveysRepositoryStub = mockLoadSurveysRepository()
        loadSurveys = new DbLoadSurveys(loadSurveysRepositoryStub)
    })

    it("Should call LoadSurveysRepository when load was called", async () => {
        const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub, "loadAll")

        await loadSurveys.load()

        expect(loadAllSpy).toHaveBeenCalled()
    })

    it("Should return a list of surveys on success", async () => {
        const surveys = await loadSurveys.load()

        expect(surveys).toEqual(mockSurveysModel())
    })

    it("Should throw if LoadSurveysRepository throws", async () => {
        jest.spyOn(loadSurveysRepositoryStub, "loadAll").mockImplementationOnce(throwError)

        const promise = loadSurveys.load()

        await expect(promise).rejects.toThrow()
    })
})
