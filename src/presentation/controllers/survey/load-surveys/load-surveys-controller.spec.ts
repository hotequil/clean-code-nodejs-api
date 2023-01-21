import { LoadSurveysController } from "./load-surveys-controller";
import { HttpRequest, LoadSurveys } from "./load-surveys-controller-protocols";
import * as MockDate from "mockdate";
import StatusCode from "status-code-enum";
import { badRequest, noContent, success } from "../../../helpers/http-helper";
import { mockLoadSurveys, mockSurveysModel, throwError } from "@/utils/tests";

let controller: LoadSurveysController
let loadSurveysStub: LoadSurveys
const mockHttpRequest = (): HttpRequest => ({})

describe(LoadSurveysController.name, () => {
    beforeAll(() => MockDate.set(new Date()))
    afterAll(() => MockDate.reset())

    beforeEach(() => {
        loadSurveysStub = mockLoadSurveys()
        controller = new LoadSurveysController(loadSurveysStub)
    })

    it("Should call LoadSurveys when handle was called", async () => {
        const loadSpy = jest.spyOn(loadSurveysStub, "load")

        await controller.handle(mockHttpRequest())

        expect(loadSpy).toHaveBeenCalled()
    })

    it(`Should return code ${StatusCode.SuccessOK} when handle was called with success`, async () => {
        const response = await controller.handle(mockHttpRequest())

        expect(response).toEqual(success(mockSurveysModel()))
    })

    it(`Should return code ${StatusCode.SuccessNoContent} when handle was called with empty value`, async () => {
        jest.spyOn(loadSurveysStub, "load").mockReturnValueOnce(new Promise(resolve => resolve([])))

        const response = await controller.handle(mockHttpRequest())

        expect(response).toEqual(noContent())
    })

    it(`Should return code ${StatusCode.ServerErrorInternal} if LoadSurveys throws`, async () => {
        jest.spyOn(loadSurveysStub, "load").mockImplementationOnce(throwError)

        const response = await controller.handle(mockHttpRequest())

        expect(response).toEqual(badRequest(new Error()))
    })
})
