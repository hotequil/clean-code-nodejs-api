import { LoadSurveysController } from "./load-surveys-controller";
import { HttpRequest, LoadSurveys, SurveysModel } from "./load-surveys-controller-protocols";
import * as MockDate from "mockdate";

let controller: LoadSurveysController
let loadSurveysStub: LoadSurveys

const makeFakeHttpRequest = (): HttpRequest => ({})
const makeFakeSurveys = (): SurveysModel => [
    {
        id: "id",
        question: "question",
        answers: [{ answer: "answer", image: "image" }],
        date: new Date(),
    }
]

class LoadSurveysStub implements LoadSurveys{
    async load(): Promise<SurveysModel>{
        return await new Promise(resolve => resolve(makeFakeSurveys()))
    }
}

describe(LoadSurveysController.name, () => {
    beforeAll(() => MockDate.set(new Date()))
    afterAll(() => MockDate.reset())

    beforeEach(() => {
        loadSurveysStub = new LoadSurveysStub()
        controller = new LoadSurveysController(loadSurveysStub)
    })

    it("Should call LoadSurveys when handle was called", async () => {
        const loadSpy = jest.spyOn(loadSurveysStub, "load")

        await controller.handle(makeFakeHttpRequest())

        expect(loadSpy).toHaveBeenCalled()
    })
})
