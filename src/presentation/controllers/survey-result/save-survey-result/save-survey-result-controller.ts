import { Controller, HttpRequest, HttpResponse, LoadSurveyById } from "./save-survey-result-protocols";
import { success } from "@/presentation/helpers/http-helper";

export class SaveSurveyResultController implements Controller{
    constructor(private readonly loadSurveyById: LoadSurveyById){}

    async handle(request: HttpRequest<any, { surveyId: string }>): Promise<HttpResponse>{
        const surveyId = request?.params?.surveyId as string

        await this.loadSurveyById.loadById(surveyId)

        return success(null);
    }
}
