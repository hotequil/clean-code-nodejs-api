import { LoadSurveyResultController } from "./load-survey-result-controller";
import { LoadSurveyById, LoadSurveyResult } from "./load-survey-result-protocols";
import { mockLoadSurveyById, mockLoadSurveyResult, mockSurveyResultModel, throwError } from "@/utils/tests";
import StatusCode from "status-code-enum";
import { forbidden, serverError, success } from "@/presentation/helpers/http-helper";
import { InvalidParamsError } from "@/presentation/errors";
import MockDate from "mockdate";

let controller: LoadSurveyResultController
let loadSurveyByIdStub: LoadSurveyById
let loadSurveyResultStub: LoadSurveyResult
const SURVEY_ID = "survey-id"
const ACCOUNT_ID = "account-id"

const mockRequest = (): LoadSurveyResultController.Request => ({
    surveyId: SURVEY_ID,
    accountId: ACCOUNT_ID,
})

describe(LoadSurveyResultController.name, () => {
    beforeAll(() => {
        MockDate.set(new Date())
    })

    afterAll(() => {
        MockDate.reset()
    })

    beforeEach(() => {
        loadSurveyByIdStub = mockLoadSurveyById(SURVEY_ID)
        loadSurveyResultStub = mockLoadSurveyResult()
        controller = new LoadSurveyResultController(loadSurveyByIdStub, loadSurveyResultStub)
    })

    it("Should call LoadSurveyById with correct value", async () => {
        const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, "loadById")

        await controller.handle(mockRequest())

        expect(loadByIdSpy).toBeCalledWith(SURVEY_ID)
    })

    it(`Should return code ${StatusCode.ClientErrorForbidden} if LoadSurveyById returns null`, async () => {
        jest.spyOn(loadSurveyByIdStub, "loadById").mockReturnValueOnce(Promise.resolve(null))

        const response = await controller.handle(mockRequest())

        expect(response).toEqual(forbidden(new InvalidParamsError("surveyId")))
    })

    it(`Should return code ${StatusCode.ServerErrorInternal} if LoadSurveyById throws`, async () => {
        jest.spyOn(loadSurveyByIdStub, "loadById").mockImplementationOnce(throwError)

        const response = await controller.handle(mockRequest())

        expect(response).toEqual(serverError(new Error()))
    })

    it("Should call LoadSurveyResult with correct values", async () => {
        const loadSpy = jest.spyOn(loadSurveyResultStub, "load")

        await controller.handle(mockRequest())

        expect(loadSpy).toBeCalledWith(SURVEY_ID, ACCOUNT_ID)
    })

    it(`Should return code ${StatusCode.ServerErrorInternal} if LoadSurveyResult throws`, async () => {
        jest.spyOn(loadSurveyResultStub, "load").mockImplementationOnce(throwError)

        const response = await controller.handle(mockRequest())

        expect(response).toEqual(serverError(new Error()))
    })

    it(`Should return code ${StatusCode.SuccessOK} on success`, async () => {
        const response = await controller.handle(mockRequest())

        expect(response).toEqual(success(mockSurveyResultModel(SURVEY_ID)))
    })
})
