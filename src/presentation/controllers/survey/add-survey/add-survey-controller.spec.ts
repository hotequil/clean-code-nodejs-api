import { AddSurveyController } from "./add-survey-controller";
import { HttpRequest, Validation } from "./add-survey-controller-protocols";
import { AnyObject } from "../../../../utils/helpers";

let controller: AddSurveyController
let validationStub: Validation

const makeFakeHttpRequest = (): HttpRequest => ({
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

describe("AddSurveyController", () => {
    beforeEach(() => {
        validationStub = new ValidationStub()
        controller = new AddSurveyController(validationStub)
    })

    it("Should call Validation with correct values", async () => {
        const request = makeFakeHttpRequest()
        const validationSpy = jest.spyOn(validationStub, "validate")

        await controller.handle(request)

        expect(validationSpy).toHaveBeenCalledWith(request.body)
    })
})
