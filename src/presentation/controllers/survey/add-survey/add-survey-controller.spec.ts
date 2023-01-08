import { AddSurveyController } from "./add-survey-controller";
import {
    HttpRequest,
    Validation,
    AnyObject,
    MissingParamsError,
    AddSurvey,
    AddSurveyModel
} from "./add-survey-controller-protocols";
import StatusCode from "status-code-enum";

let controller: AddSurveyController
let validationStub: Validation
let addSurveyStub: AddSurvey

const makeFakeHttpRequest = (): HttpRequest<AddSurveyModel> => ({
    body: {
        question: "a question?",
        answers: [
            {
                image: "url",
                answer: "first"
            },
            {
                image: "url",
                answer: "second"
            },
        ],
    }
})

class ValidationStub implements Validation{
    validate(value: AnyObject): Error | null {
        console.log(value);

        return null;
    }
}

class AddSurveyStub implements AddSurvey{
    async add(model: AddSurveyModel): Promise<null>{
        console.log(model)

        return await new Promise(resolve => resolve(null))
    }
}

describe(AddSurveyController.name, () => {
    beforeEach(() => {
        validationStub = new ValidationStub()
        addSurveyStub = new AddSurveyStub()
        controller = new AddSurveyController(validationStub, addSurveyStub)
    })

    it("Should call Validation with correct values", async () => {
        const request = makeFakeHttpRequest()
        const validationSpy = jest.spyOn(validationStub, "validate")

        await controller.handle(request)

        expect(validationSpy).toHaveBeenCalledWith(request.body)
    })

    it(`Should return ${StatusCode.ClientErrorBadRequest} if Validation fails`, async () => {
        jest.spyOn(validationStub, "validate").mockReturnValueOnce(new MissingParamsError("Invalid question"))

        const { statusCode } = await controller.handle(makeFakeHttpRequest())

        expect(statusCode).toBe(StatusCode.ClientErrorBadRequest)
    })

    it("Should call AddSurvey with correct values", async () => {
        const request = makeFakeHttpRequest()
        const addSurveySpy = jest.spyOn(addSurveyStub, "add")

        await controller.handle(request)

        expect(addSurveySpy).toHaveBeenCalledWith(request.body)
    })

    it(`Should return ${StatusCode.ServerErrorInternal} if AddSurvey throws`, async () => {
        jest.spyOn(addSurveyStub, "add")
            .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

        const { statusCode } = await controller.handle(makeFakeHttpRequest())

        expect(statusCode).toBe(StatusCode.ServerErrorInternal)
    })

    it(`Should return code ${StatusCode.SuccessNoContent} on success`, async () => {
        const { statusCode } = await controller.handle(makeFakeHttpRequest())

        expect(statusCode).toBe(StatusCode.SuccessNoContent)
    })
})
