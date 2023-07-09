import { AddSurveyController } from "./add-survey-controller";
import { type Validation, MissingParamsError, type AddSurvey } from "./add-survey-controller-protocols";
import StatusCode from "status-code-enum";
import * as MockDate from "mockdate";
import { mockAddSurvey, mockAddSurveyParams, mockValidation, throwError } from "@/utils/tests";

let controller: AddSurveyController
let validationStub: Validation
let addSurveyStub: AddSurvey

const mockRequest = (): AddSurveyController.Request => mockAddSurveyParams()

describe(AddSurveyController.name, () => {
    beforeAll(() => { MockDate.set(new Date()); })
    afterAll(() => { MockDate.reset(); })

    beforeEach(() => {
        validationStub = mockValidation()
        addSurveyStub = mockAddSurvey()
        controller = new AddSurveyController(validationStub, addSurveyStub)
    })

    it("Should call Validation with correct values", async () => {
        const request = mockRequest()
        const validationSpy = jest.spyOn(validationStub, "validate")

        await controller.handle(request)

        expect(validationSpy).toHaveBeenCalledWith(request)
    })

    it(`Should return ${StatusCode.ClientErrorBadRequest} if Validation fails`, async () => {
        jest.spyOn(validationStub, "validate").mockReturnValueOnce(new MissingParamsError("Invalid question"))

        const { statusCode } = await controller.handle(mockRequest())

        expect(statusCode).toBe(StatusCode.ClientErrorBadRequest)
    })

    it("Should call AddSurvey with correct values", async () => {
        const request = mockRequest()
        const addSurveySpy = jest.spyOn(addSurveyStub, "add")

        await controller.handle(request)

        expect(addSurveySpy).toHaveBeenCalledWith(request)
    })

    it(`Should return ${StatusCode.ServerErrorInternal} if AddSurvey throws`, async () => {
        jest.spyOn(addSurveyStub, "add").mockImplementationOnce(throwError)

        const { statusCode } = await controller.handle(mockRequest())

        expect(statusCode).toBe(StatusCode.ServerErrorInternal)
    })

    it(`Should return code ${StatusCode.SuccessNoContent} on success`, async () => {
        const { statusCode } = await controller.handle(mockRequest())

        expect(statusCode).toBe(StatusCode.SuccessNoContent)
    })
})
