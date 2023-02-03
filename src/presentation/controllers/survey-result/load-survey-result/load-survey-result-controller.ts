import { Controller, HttpRequest, HttpResponse, LoadSurveyById } from "./load-survey-result-protocols";
import { success } from "@/presentation/helpers/http-helper";

export class LoadSurveyResultController implements Controller{
    constructor(private readonly loadSurveyById: LoadSurveyById){}

    async handle(request: HttpRequest<any, { surveyId: string }>): Promise<HttpResponse> {
        const surveyId = request.params?.surveyId as string

        return success(await this.loadSurveyById.loadById(surveyId));
    }
}
