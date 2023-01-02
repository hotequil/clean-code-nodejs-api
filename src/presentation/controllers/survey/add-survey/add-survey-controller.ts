import { Controller, HttpRequest, HttpResponse, Validation } from "./add-survey-controller-protocols";
import { success } from "../../../helpers/http-helper";

export class AddSurveyController implements Controller{
    constructor(private readonly validation: Validation){}

    async handle(request: HttpRequest): Promise<HttpResponse>{
        this.validation.validate(request.body)

        return await new Promise(resolve => resolve(success(null)));
    }
}
