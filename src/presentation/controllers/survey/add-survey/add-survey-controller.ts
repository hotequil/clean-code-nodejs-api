import {
    badRequest,
    Controller,
    HttpRequest,
    HttpResponse,
    success,
    Validation
} from "./add-survey-controller-protocols";

export class AddSurveyController implements Controller{
    constructor(private readonly validation: Validation){}

    async handle(request: HttpRequest): Promise<HttpResponse>{
        const error = this.validation.validate(request.body)
        let response = success(null)

        if(error) response = badRequest(error)

        return await new Promise(resolve => resolve(response));
    }
}
