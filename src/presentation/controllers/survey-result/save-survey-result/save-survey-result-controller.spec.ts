import { SaveSurveyResultController } from "./save-survey-result-controller";
import { LoadSurveyById, HttpRequest, SurveyModel, SaveSurveyResult, SaveSurveyResultParams, SurveyResultModel } from "./save-survey-result-protocols";
import * as MockDate from "mockdate";
import StatusCode from "status-code-enum";
import { forbidden, serverError, success } from "@/presentation/helpers/http-helper";
import { InvalidParamsError } from "@/presentation/errors";
import { mockSurveyModel, throwError } from "@/utils/tests";

let controller: SaveSurveyResultController
let loadSurveyByIdStub: LoadSurveyById
let saveSurveyResultStub: SaveSurveyResult
const SURVEY_ID = "surveyId"
const VALID_ANSWER = "valid-answer"
const ACCOUNT_ID = "accountId"

const makeFakeRequest = (): HttpRequest<{ answer: string }, { surveyId: string }> => ({
    params: {
        surveyId: SURVEY_ID
    },
    body: {
        answer: VALID_ANSWER,
    },
    accountId: ACCOUNT_ID,
})

const makeFakeSurveyResult = (): SurveyResultModel => ({
    id: "id",
    surveyId: SURVEY_ID,
    accountId: ACCOUNT_ID,
    answer: VALID_ANSWER,
    date: new Date(),
})

class LoadSurveyByIdStub implements LoadSurveyById{
    async loadById(id: string | Object): Promise<SurveyModel | null> {
        console.log(id)

        return await new Promise(resolve => resolve(mockSurveyModel(SURVEY_ID, VALID_ANSWER)));
    }
}

class SaveSurveyResultStub implements SaveSurveyResult{
    async save(data: SaveSurveyResultParams): Promise<SurveyResultModel | null> {
        console.log(data)

        return await new Promise(resolve => resolve(makeFakeSurveyResult()));
    }
}

describe(SaveSurveyResultController.name, () => {
    beforeAll(() => MockDate.set(new Date()))
    afterAll(() => MockDate.reset())

    beforeEach(() => {
        loadSurveyByIdStub = new LoadSurveyByIdStub()
        saveSurveyResultStub = new SaveSurveyResultStub()
        controller = new SaveSurveyResultController(loadSurveyByIdStub, saveSurveyResultStub)
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
        jest.spyOn(loadSurveyByIdStub, "loadById").mockImplementationOnce(throwError)

        const response = await controller.handle(makeFakeRequest())

        expect(response).toEqual(serverError(new Error()))
    })

    it(`Should return code ${StatusCode.ClientErrorForbidden} if an invalid answer is provided`, async () => {
        const request = makeFakeRequest()

        if(request?.body) request.body.answer = "invalid-answer"

        const response = await controller.handle(request)

        expect(response).toEqual(forbidden(new InvalidParamsError("answer")))
    })

    it("Should call SaveSurveyResult with correct values", async () => {
        const saveSpy = jest.spyOn(saveSurveyResultStub, "save")
        const request = makeFakeRequest()

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

        const response = await controller.handle(makeFakeRequest())

        expect(response).toEqual(serverError(new Error()))
    })

    it(`Should return code ${StatusCode.SuccessOK} when handle was called with success`, async () => {
        const response = await controller.handle(makeFakeRequest())

        expect(response).toEqual(success(makeFakeSurveyResult()))
    })
})
