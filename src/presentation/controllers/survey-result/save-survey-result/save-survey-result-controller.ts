import { Controller, HttpRequest, HttpResponse, LoadSurveyById, SaveSurveyResult } from "./save-survey-result-protocols";
import { forbidden, serverError, success } from "@/presentation/helpers/http-helper";
import { InvalidParamsError } from "@/presentation/errors";

export class SaveSurveyResultController implements Controller{
    constructor(private readonly loadSurveyById: LoadSurveyById, private readonly saveSurveyResult: SaveSurveyResult){}

    async handle(request: HttpRequest<{ answer: string }, { surveyId: string }>): Promise<HttpResponse>{
        try{
            const surveyId = request?.params?.surveyId as string
            const survey = await this.loadSurveyById.loadById(surveyId)

            if (!survey) return forbidden(new InvalidParamsError("surveyId"))

            const answers = survey.answers.map(({ answer }) => answer)
            const answer = request.body?.answer as string
            const hasAnswer = answers.includes(answer)

            if(!hasAnswer) return forbidden(new InvalidParamsError("answer"))

            const result = await this.saveSurveyResult.save({
                answer,
                surveyId,
                accountId: request.accountId as string,
                date: new Date(),
            })

            return success(result);
        } catch(error){
            return serverError(error as Error)
        }
    }
}
