import { SaveSurveyResultController } from "./save-survey-result-controller";
import { LoadSurveyById, HttpRequest, SurveyModel } from "./save-survey-result-protocols";
import * as MockDate from "mockdate";
import StatusCode from "status-code-enum";
import { forbidden, serverError } from "@/presentation/helpers/http-helper";
import { InvalidParamsError } from "@/presentation/errors";

let controller: SaveSurveyResultController
let loadSurveyByIdStub: LoadSurveyById
const SURVEY_ID = "surveyId"
const VALID_ANSWER = "valid-answer"

const makeFakeRequest = (): HttpRequest<{ answer: string }, { surveyId: string }> => ({
    params: {
        surveyId: SURVEY_ID
    },
    body: {
        answer: VALID_ANSWER
    }
})

const makeFakeSurvey = (): SurveyModel => ({
    id: SURVEY_ID,
    question: "question",
    answers: [{ answer: "answer", image: "image" }, { answer: VALID_ANSWER, image: "image" }],
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

    it(`Should return code ${StatusCode.ClientErrorForbidden} when LoadSurveyById returns null`, async () => {
        jest.spyOn(loadSurveyByIdStub, "loadById").mockReturnValueOnce(new Promise(resolve => resolve(null)))

        const { statusCode } = await controller.handle(makeFakeRequest())

        expect(statusCode).toBe(StatusCode.ClientErrorForbidden)
    })

    it(`Should return code ${StatusCode.ServerErrorInternal} if LoadSurveyById throws`, async () => {
        const error = new Error()

        jest.spyOn(loadSurveyByIdStub, "loadById").mockReturnValueOnce(new Promise((resolve, reject) => reject(error)))

        const response = await controller.handle(makeFakeRequest())

        expect(response).toEqual(serverError(error))
    })

    it(`Should return code ${StatusCode.ClientErrorForbidden} if an invalid answer is provided`, async () => {
        const request = makeFakeRequest()

        if(request?.body) request.body.answer = "invalid-answer"

        const response = await controller.handle(request)

        expect(response).toEqual(forbidden(new InvalidParamsError("answer")))
    })
})
