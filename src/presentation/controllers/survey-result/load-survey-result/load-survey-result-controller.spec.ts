import { LoadSurveyResultController } from "./load-survey-result-controller";
import { LoadSurveyById, HttpRequest } from "./load-survey-result-protocols";
import { mockLoadSurveyById } from "@/utils/tests";

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
})
