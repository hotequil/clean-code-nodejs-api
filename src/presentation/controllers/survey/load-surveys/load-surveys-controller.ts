import { Controller, HttpRequest, HttpResponse, LoadSurveys } from "./load-surveys-controller-protocols";
import { success } from "../../../helpers/http-helper";

export class LoadSurveysController implements Controller{
    constructor(private readonly loadSurveys: LoadSurveys){}

    async handle(request: HttpRequest): Promise<HttpResponse> {
        console.log(request)

        return success(await this.loadSurveys.load())
    }
}
