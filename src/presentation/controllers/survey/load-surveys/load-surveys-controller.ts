import { Controller, HttpRequest, HttpResponse, LoadSurveys } from "./load-surveys-controller-protocols";
import { badRequest, success } from "../../../helpers/http-helper";

export class LoadSurveysController implements Controller{
    constructor(private readonly loadSurveys: LoadSurveys){}

    async handle(request: HttpRequest): Promise<HttpResponse> {
        try{
            console.log(request)

            return success(await this.loadSurveys.load())
        } catch(error: any){
            return badRequest(error)
        }
    }
}
