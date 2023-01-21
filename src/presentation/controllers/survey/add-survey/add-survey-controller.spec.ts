import { AddSurveyController } from "./add-survey-controller";
import {
    HttpRequest,
    Validation,
    AnyObject,
    MissingParamsError,
    AddSurvey,
    AddSurveyParams
} from "./add-survey-controller-protocols";
import StatusCode from "status-code-enum";
import * as MockDate from "mockdate";
import { mockAddSurveyParams, throwError } from "@/utils/tests";

let controller: AddSurveyController
let validationStub: Validation
let addSurveyStub: AddSurvey

const mockHttpRequest = (): HttpRequest<AddSurveyParams> => ({
    body: mockAddSurveyParams()
})

class ValidationStub implements Validation{
    validate(value: AnyObject): Error | null {
        console.log(value);

        return null;
    }
}

class AddSurveyStub implements AddSurvey{
    async add(model: AddSurveyParams): Promise<null>{
        console.log(model)

        return await new Promise(resolve => resolve(null))
    }
}

describe(AddSurveyController.name, () => {
    beforeAll(() => MockDate.set(new Date()))
    afterAll(() => MockDate.reset())

    beforeEach(() => {
        validationStub = new ValidationStub()
        addSurveyStub = new AddSurveyStub()
        controller = new AddSurveyController(validationStub, addSurveyStub)
    })

    it("Should call Validation with correct values", async () => {
        const request = mockHttpRequest()
        const validationSpy = jest.spyOn(validationStub, "validate")

        await controller.handle(request)

        expect(validationSpy).toHaveBeenCalledWith(request.body)
    })

    it(`Should return ${StatusCode.ClientErrorBadRequest} if Validation fails`, async () => {
        jest.spyOn(validationStub, "validate").mockReturnValueOnce(new MissingParamsError("Invalid question"))

        const { statusCode } = await controller.handle(mockHttpRequest())

        expect(statusCode).toBe(StatusCode.ClientErrorBadRequest)
    })

    it("Should call AddSurvey with correct values", async () => {
        const request = mockHttpRequest()
        const addSurveySpy = jest.spyOn(addSurveyStub, "add")

        await controller.handle(request)

        expect(addSurveySpy).toHaveBeenCalledWith(request.body)
    })

    it(`Should return ${StatusCode.ServerErrorInternal} if AddSurvey throws`, async () => {
        jest.spyOn(addSurveyStub, "add").mockImplementationOnce(throwError)

        const { statusCode } = await controller.handle(mockHttpRequest())

        expect(statusCode).toBe(StatusCode.ServerErrorInternal)
    })

    it(`Should return code ${StatusCode.SuccessNoContent} on success`, async () => {
        const { statusCode } = await controller.handle(mockHttpRequest())

        expect(statusCode).toBe(StatusCode.SuccessNoContent)
    })
})
