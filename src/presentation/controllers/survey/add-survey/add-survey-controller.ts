import {
    AddSurvey,
    badRequest,
    Controller,
    HttpRequest,
    HttpResponse,
    success,
    Validation
} from "./add-survey-controller-protocols";

export class AddSurveyController implements Controller{
    constructor(private readonly validation: Validation, private readonly addSurvey: AddSurvey){}

    async handle(request: HttpRequest): Promise<HttpResponse>{
        const { body } = request
        const error = this.validation.validate(body)

        if(error) return badRequest(error)

        await this.addSurvey.add(body)

        return success(null);
    }
}
