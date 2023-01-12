import { Controller, HttpRequest, HttpResponse, LoadSurveys } from "./load-surveys-controller-protocols";
import { badRequest, noContent, success } from "../../../helpers/http-helper";

export class LoadSurveysController implements Controller{
    constructor(private readonly loadSurveys: LoadSurveys){}

    async handle(request: HttpRequest): Promise<HttpResponse> {
        try{
            console.log(request)

            const list = await this.loadSurveys.load()

            return list.length ? success(list) : noContent()
        } catch(error: any){
            return badRequest(error)
        }
    }
}
