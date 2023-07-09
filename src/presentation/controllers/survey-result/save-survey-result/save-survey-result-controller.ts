import { type Controller, type HttpResponse, type LoadAnswersBySurvey, type SaveSurveyResult } from "./save-survey-result-protocols";
import { forbidden, serverError, success } from "@/presentation/helpers/http-helper";
import { InvalidParamsError } from "@/presentation/errors";

export class SaveSurveyResultController implements Controller {
    constructor(private readonly loadAnswersBySurvey: LoadAnswersBySurvey, private readonly saveSurveyResult: SaveSurveyResult) {}

    async handle(request: SaveSurveyResultController.Request): Promise<HttpResponse> {
        try{
            const { surveyId } = request
            const answers = await this.loadAnswersBySurvey.loadAnswers(surveyId)

            if (!answers.length) return forbidden(new InvalidParamsError("surveyId"))

            const { answer } = request
            const hasAnswer = answers.includes(answer)

            if(!hasAnswer) return forbidden(new InvalidParamsError("answer"))

            const result = await this.saveSurveyResult.save({
                answer,
                surveyId,
                accountId: request.accountId,
                date: new Date()
            })

            return success(result);
        } catch(error) {
            return serverError(error as Error)
        }
    }
}

export namespace SaveSurveyResultController{
    export type Request = {
        answer: string
        surveyId: string
        accountId: string
    }
}
