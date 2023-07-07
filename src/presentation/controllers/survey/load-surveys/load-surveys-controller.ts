import { Controller, HttpResponse, LoadSurveys } from "./load-surveys-controller-protocols";
import { badRequest, noContent, success } from "../../../helpers/http-helper";

export class LoadSurveysController implements Controller{
    constructor(private readonly loadSurveys: LoadSurveys){}

    async handle(request: LoadSurveysController.Request): Promise<HttpResponse> {
        try{
            const list = await this.loadSurveys.load(request.accountId)

            return list.length ? success(list) : noContent()
        } catch(error: any){
            return badRequest(error)
        }
    }
}

export namespace LoadSurveysController{
    export type Request = {
        accountId: string
    }
}
