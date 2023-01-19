import { DbLoadSurveys } from "./db-load-surveys";
import { SurveysModel, LoadSurveysRepository } from "./db-load-surveys-protocols";
import * as MockDate from "mockdate";

let loadSurveys: DbLoadSurveys
let loadSurveysRepositoryStub: LoadSurveysRepository

const makeFakeSurveysModel = (): SurveysModel => [
    {
        id: "id",
        date: new Date(),
        answers: [{ answer: "answer", image: "image" }],
        question: "question",
    }
]

class LoadSurveysRepositoryStub implements LoadSurveysRepository{
    async loadAll(): Promise<SurveysModel>{
        return await new Promise(resolve => resolve(makeFakeSurveysModel()))
    }
}

describe(DbLoadSurveys.name, () => {
    beforeAll(() => MockDate.set(new Date()))
    afterAll(() => MockDate.reset())

    beforeEach(() => {
        loadSurveysRepositoryStub = new LoadSurveysRepositoryStub()
        loadSurveys = new DbLoadSurveys(loadSurveysRepositoryStub)
    })

    it("Should call LoadSurveysRepository when load was called", async () => {
        const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub, "loadAll")

        await loadSurveys.load()

        expect(loadAllSpy).toHaveBeenCalled()
    })

    it("Should return a list of surveys on success", async () => {
        const surveys = await loadSurveys.load()

        expect(surveys).toEqual(makeFakeSurveysModel())
    })

    it("Should throw if LoadSurveysRepository throws", async () => {
        jest.spyOn(loadSurveysRepositoryStub, "loadAll")
            .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

        const promise = loadSurveys.load()

        await expect(promise).rejects.toThrow()
    })
})
