import { DbLoadSurveys } from "./db-load-surveys";
import { SurveysModel, LoadSurveysRepository } from "./db-load-surveys-protocols";

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
    beforeEach(() => {
        loadSurveysRepositoryStub = new LoadSurveysRepositoryStub()
        loadSurveys = new DbLoadSurveys(loadSurveysRepositoryStub)
    })

    it("Should call LoadSurveysRepository when load was called", async () => {
        const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub, "loadAll")

        await loadSurveys.load()

        expect(loadAllSpy).toHaveBeenCalled()
    })
})
