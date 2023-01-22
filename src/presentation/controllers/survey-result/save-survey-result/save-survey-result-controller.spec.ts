import { SaveSurveyResultController } from "./save-survey-result-controller";
import { LoadSurveyById, HttpRequest, SaveSurveyResult } from "./save-survey-result-protocols";
import * as MockDate from "mockdate";
import StatusCode from "status-code-enum";
import { forbidden, serverError, success } from "@/presentation/helpers/http-helper";
import { InvalidParamsError } from "@/presentation/errors";
import { mockLoadSurveyById, mockSaveSurveyResult, mockSurveyResultModel, throwError } from "@/utils/tests";

let controller: SaveSurveyResultController
let loadSurveyByIdStub: LoadSurveyById
let saveSurveyResultStub: SaveSurveyResult
const SURVEY_ID = "surveyId"
const VALID_ANSWER = "valid-answer"
const ACCOUNT_ID = "accountId"

const mockHttpRequest = (): HttpRequest<{ answer: string }, { surveyId: string }> => ({
    params: {
        surveyId: SURVEY_ID
    },
    body: {
        answer: VALID_ANSWER,
    },
    accountId: ACCOUNT_ID,
})

describe(SaveSurveyResultController.name, () => {
    beforeAll(() => MockDate.set(new Date()))
    afterAll(() => MockDate.reset())

    beforeEach(() => {
        loadSurveyByIdStub = mockLoadSurveyById(SURVEY_ID, VALID_ANSWER)
        saveSurveyResultStub = mockSaveSurveyResult(SURVEY_ID, ACCOUNT_ID, VALID_ANSWER)
        controller = new SaveSurveyResultController(loadSurveyByIdStub, saveSurveyResultStub)
    })

    it("Should call LoadSurveyById with correct values", async () => {
        const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, "loadById")

        await controller.handle(mockHttpRequest())

        expect(loadByIdSpy).toHaveBeenCalledWith(SURVEY_ID)
    })

    it(`Should return code ${StatusCode.ClientErrorForbidden} when LoadSurveyById returns null`, async () => {
        jest.spyOn(loadSurveyByIdStub, "loadById").mockReturnValueOnce(Promise.resolve(null))

        const { statusCode } = await controller.handle(mockHttpRequest())

        expect(statusCode).toBe(StatusCode.ClientErrorForbidden)
    })

    it(`Should return code ${StatusCode.ServerErrorInternal} if LoadSurveyById throws`, async () => {
        jest.spyOn(loadSurveyByIdStub, "loadById").mockImplementationOnce(throwError)

        const response = await controller.handle(mockHttpRequest())

        expect(response).toEqual(serverError(new Error()))
    })

    it(`Should return code ${StatusCode.ClientErrorForbidden} if an invalid answer is provided`, async () => {
        const request = mockHttpRequest()

        if(request?.body) request.body.answer = "invalid-answer"

        const response = await controller.handle(request)

        expect(response).toEqual(forbidden(new InvalidParamsError("answer")))
    })

    it("Should call SaveSurveyResult with correct values", async () => {
        const saveSpy = jest.spyOn(saveSurveyResultStub, "save")
        const request = mockHttpRequest()

        await controller.handle(request)

        expect(saveSpy).toHaveBeenCalledWith({
            accountId: request.accountId,
            surveyId: request.params?.surveyId,
            answer: request.body?.answer,
            date: new Date()
        })
    })

    it(`Should return code ${StatusCode.ServerErrorInternal} if SaveSurveyResult throws`, async () => {
        jest.spyOn(saveSurveyResultStub, "save").mockImplementationOnce(throwError)

        const response = await controller.handle(mockHttpRequest())

        expect(response).toEqual(serverError(new Error()))
    })

    it(`Should return code ${StatusCode.SuccessOK} when handle was called with success`, async () => {
        const response = await controller.handle(mockHttpRequest())

        expect(response).toEqual(success(mockSurveyResultModel(SURVEY_ID, ACCOUNT_ID, VALID_ANSWER)))
    })
})
