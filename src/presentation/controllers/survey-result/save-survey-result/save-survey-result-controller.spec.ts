import { SaveSurveyResultController } from "./save-survey-result-controller";
import { type LoadAnswersBySurvey, type SaveSurveyResult } from "./save-survey-result-protocols";
import * as MockDate from "mockdate";
import StatusCode from "status-code-enum";
import { forbidden, serverError, success } from "@/presentation/helpers/http-helper";
import { InvalidParamsError } from "@/presentation/errors";
import { mockLoadAnswersBySurvey, mockSaveSurveyResult, mockSurveyResultModel, throwError } from "@/utils/tests";

let controller: SaveSurveyResultController
let loadAnswersBySurveyStub: LoadAnswersBySurvey
let saveSurveyResultStub: SaveSurveyResult
const SURVEY_ID = "surveyId"
const VALID_ANSWER = "valid-answer"
const ACCOUNT_ID = "accountId"

const mockRequest = (): SaveSurveyResultController.Request => ({
    surveyId: SURVEY_ID,
    answer: VALID_ANSWER,
    accountId: ACCOUNT_ID
})

describe(SaveSurveyResultController.name, () => {
    beforeAll(() => { MockDate.set(new Date()); })
    afterAll(() => { MockDate.reset(); })

    beforeEach(() => {
        loadAnswersBySurveyStub = mockLoadAnswersBySurvey(SURVEY_ID, VALID_ANSWER)
        saveSurveyResultStub = mockSaveSurveyResult(SURVEY_ID)
        controller = new SaveSurveyResultController(loadAnswersBySurveyStub, saveSurveyResultStub)
    })

    it("Should call LoadAnswersBySurvey with correct values", async () => {
        const loadAnswersSpy = jest.spyOn(loadAnswersBySurveyStub, "loadAnswers")

        await controller.handle(mockRequest())

        expect(loadAnswersSpy).toHaveBeenCalledWith(SURVEY_ID)
    })

    it(`Should return code ${StatusCode.ClientErrorForbidden} when LoadAnswersBySurvey returns an empty array`, async () => {
        jest.spyOn(loadAnswersBySurveyStub, "loadAnswers").mockReturnValueOnce(Promise.resolve([]))

        const { statusCode } = await controller.handle(mockRequest())

        expect(statusCode).toBe(StatusCode.ClientErrorForbidden)
    })

    it(`Should return code ${StatusCode.ServerErrorInternal} if LoadAnswersBySurvey throws`, async () => {
        jest.spyOn(loadAnswersBySurveyStub, "loadAnswers").mockImplementationOnce(throwError)

        const response = await controller.handle(mockRequest())

        expect(response).toEqual(serverError(new Error()))
    })

    it(`Should return code ${StatusCode.ClientErrorForbidden} if an invalid answer is provided`, async () => {
        const request = mockRequest()

        request.answer = "invalid-answer"

        const response = await controller.handle(request)

        expect(response).toEqual(forbidden(new InvalidParamsError("answer")))
    })

    it("Should call SaveSurveyResult with correct values", async () => {
        const saveSpy = jest.spyOn(saveSurveyResultStub, "save")
        const request = mockRequest()
        const { accountId, surveyId, answer } = request

        await controller.handle(request)

        expect(saveSpy).toHaveBeenCalledWith({ accountId, surveyId, answer, date: new Date() })
    })

    it(`Should return code ${StatusCode.ServerErrorInternal} if SaveSurveyResult throws`, async () => {
        jest.spyOn(saveSurveyResultStub, "save").mockImplementationOnce(throwError)

        const response = await controller.handle(mockRequest())

        expect(response).toEqual(serverError(new Error()))
    })

    it(`Should return code ${StatusCode.SuccessOK} when handle was called with success`, async () => {
        const response = await controller.handle(mockRequest())

        expect(response).toEqual(success(mockSurveyResultModel(SURVEY_ID)))
    })
})
