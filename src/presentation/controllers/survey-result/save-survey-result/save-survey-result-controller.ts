import { Controller, HttpRequest, HttpResponse, LoadSurveyById } from "./save-survey-result-protocols";
import { forbidden, success } from "@/presentation/helpers/http-helper";
import { InvalidParamsError } from "@/presentation/errors";

export class SaveSurveyResultController implements Controller{
    constructor(private readonly loadSurveyById: LoadSurveyById){}

    async handle(request: HttpRequest<any, { surveyId: string }>): Promise<HttpResponse>{
        const surveyId = request?.params?.surveyId as string
        const survey = await this.loadSurveyById.loadById(surveyId)

        if (!survey) return forbidden(new InvalidParamsError("surveyId"))

        return success(null);
    }
}
