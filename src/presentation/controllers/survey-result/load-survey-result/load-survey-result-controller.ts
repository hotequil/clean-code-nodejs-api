import {
    Controller,
    HttpRequest,
    HttpResponse,
    LoadSurveyById,
    LoadSurveyResult
} from "./load-survey-result-protocols";
import { forbidden, serverError, success } from "@/presentation/helpers/http-helper";
import { InvalidParamsError } from "@/presentation/errors";

export class LoadSurveyResultController implements Controller{
    constructor(
        private readonly loadSurveyById: LoadSurveyById,
        private readonly loadSurveyResult: LoadSurveyResult,
    ){}

    async handle(request: HttpRequest<any, { surveyId: string }>): Promise<HttpResponse> {
        try{
            const surveyId = request.params?.surveyId as string
            const survey = await this.loadSurveyById.loadById(surveyId)

            if(!survey) return forbidden(new InvalidParamsError("surveyId"))

            return success(await this.loadSurveyResult.load(surveyId));
        } catch (error) {
            return serverError(error as Error)
        }
    }
}
