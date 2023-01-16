import { SaveSurveyResultController } from "./save-survey-result-controller";
import { LoadSurveyById, HttpRequest, SurveyModel } from "./save-survey-result-protocols";
import * as MockDate from "mockdate";

let controller: SaveSurveyResultController
let loadSurveyByIdStub: LoadSurveyById
const SURVEY_ID = "surveyId"

const makeFakeRequest = (): HttpRequest<any, { surveyId: string }> => ({
    params: {
        surveyId: SURVEY_ID
    },
})

const makeFakeSurvey = (): SurveyModel => ({
    id: SURVEY_ID,
    question: "question",
    answers: [{ answer: "answer", image: "image" }, { answer: "answer", image: "image" }],
    date: new Date(),
})

class LoadSurveyByIdStub implements LoadSurveyById{
    async loadById(id: string | Object): Promise<SurveyModel | null> {
        console.log(id)

        return await new Promise(resolve => resolve(makeFakeSurvey()));
    }
}

describe(SaveSurveyResultController.name, () => {
    beforeAll(() => MockDate.set(new Date()))
    afterAll(() => MockDate.reset())

    beforeEach(() => {
        loadSurveyByIdStub = new LoadSurveyByIdStub()
        controller = new SaveSurveyResultController(loadSurveyByIdStub)
    })

    it("Should call LoadSurveyById with correct values", async () => {
        const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, "loadById")

        await controller.handle(makeFakeRequest())

        expect(loadByIdSpy).toHaveBeenCalledWith(SURVEY_ID)
    })
})