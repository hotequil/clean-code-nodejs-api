import { LoadSurveysController } from "./load-surveys-controller";
import { HttpRequest, LoadSurveys, SurveysModel } from "./load-surveys-controller-protocols";
import * as MockDate from "mockdate";
import StatusCode from "status-code-enum";
import { badRequest, success } from "../../../helpers/http-helper";

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

    it(`Should return code ${StatusCode.SuccessOK} when handle was called with success`, async () => {
        const response = await controller.handle(makeFakeHttpRequest())

        expect(response).toEqual(success(makeFakeSurveys()))
    })

    it(`Should return code ${StatusCode.ServerErrorInternal} if LoadSurveys throws`, async () => {
        jest.spyOn(loadSurveysStub, "load").mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

        const response = await controller.handle(makeFakeHttpRequest())

        expect(response).toEqual(badRequest(new Error()))
    })
})
