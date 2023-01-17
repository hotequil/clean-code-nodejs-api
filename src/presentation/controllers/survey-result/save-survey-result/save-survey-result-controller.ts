import { Controller, HttpRequest, HttpResponse, LoadSurveyById } from "./save-survey-result-protocols";
import { forbidden, serverError, success } from "@/presentation/helpers/http-helper";
import { InvalidParamsError } from "@/presentation/errors";

export class SaveSurveyResultController implements Controller{
    constructor(private readonly loadSurveyById: LoadSurveyById){}

    async handle(request: HttpRequest<{ answer: string }, { surveyId: string }>): Promise<HttpResponse>{
        try{
            const surveyId = request?.params?.surveyId as string
            const survey = await this.loadSurveyById.loadById(surveyId)

            if (!survey) return forbidden(new InvalidParamsError("surveyId"))

            const answers = survey.answers.map(({ answer }) => answer)
            const answer = request?.body?.answer as string
            const hasAnswer = answers.includes(answer)

            if(!hasAnswer) return forbidden(new InvalidParamsError("answer"))

            return success(null);
        } catch(error){
            return serverError(error as Error)
        }
    }
}
