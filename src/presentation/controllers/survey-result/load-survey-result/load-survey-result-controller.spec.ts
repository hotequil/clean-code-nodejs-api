import { LoadSurveyResultController } from "./load-survey-result-controller";
import { LoadSurveyById, HttpRequest } from "./load-survey-result-protocols";
import { mockLoadSurveyById, throwError } from "@/utils/tests";
import StatusCode from "status-code-enum";
import { forbidden, serverError } from "@/presentation/helpers/http-helper";
import { InvalidParamsError } from "@/presentation/errors";

let controller: LoadSurveyResultController
let loadSurveyByIdStub: LoadSurveyById
const SURVEY_ID = "survey-id"

const mockHttpRequest = (): HttpRequest<any, { surveyId: string }> => ({
    params: {
        surveyId: SURVEY_ID
    }
})

describe(LoadSurveyResultController.name, () => {
    beforeEach(() => {
        loadSurveyByIdStub = mockLoadSurveyById(SURVEY_ID)
        controller = new LoadSurveyResultController(loadSurveyByIdStub)
    })

    it("Should call LoadSurveyById with correct value", async () => {
        const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, "loadById")

        await controller.handle(mockHttpRequest())

        expect(loadByIdSpy).toBeCalledWith(SURVEY_ID)
    })

    it(`Should return code ${StatusCode.ClientErrorForbidden} if LoadSurveyById returns null`, async () => {
        jest.spyOn(loadSurveyByIdStub, "loadById").mockReturnValueOnce(Promise.resolve(null))

        const response = await controller.handle(mockHttpRequest())

        expect(response).toEqual(forbidden(new InvalidParamsError("surveyId")))
    })

    it(`Should return code ${StatusCode.ServerErrorInternal} if LoadSurveyById throws`, async () => {
        jest.spyOn(loadSurveyByIdStub, "loadById").mockImplementationOnce(throwError)

        const response = await controller.handle(mockHttpRequest())

        expect(response).toEqual(serverError(new Error()))
    })
})
