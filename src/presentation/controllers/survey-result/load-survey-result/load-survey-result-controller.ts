import { type Controller, type HttpResponse, type LoadSurveyResult } from "./load-survey-result-protocols";
import { forbidden, serverError, success } from "@/presentation/helpers/http-helper";
import { InvalidParamsError } from "@/presentation/errors";
import { type CheckSurveyById } from "@/domain/use-cases/survey/check-survey-by-id";

export class LoadSurveyResultController implements Controller {
    constructor(
        private readonly checkSurveyById: CheckSurveyById,
        private readonly loadSurveyResult: LoadSurveyResult
    ) {}

    async handle(request: LoadSurveyResultController.Request): Promise<HttpResponse> {
        try{
            const surveyId = request.surveyId
            const exists = await this.checkSurveyById.checkById(surveyId)

            if(!exists) return forbidden(new InvalidParamsError("surveyId"))

            return success(await this.loadSurveyResult.load(surveyId, request.accountId));
        } catch (error) {
            return serverError(error as Error)
        }
    }
}

export namespace LoadSurveyResultController{
    export type Request = {
        surveyId: string
        accountId: string
    }
}
