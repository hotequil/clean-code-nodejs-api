import {
    AddSurvey,
    badRequest,
    Controller,
    HttpResponse,
    noContent,
    serverError,
    Validation,
    SurveyAnswersModel
} from "./add-survey-controller-protocols";

export class AddSurveyController implements Controller{
    constructor(private readonly validation: Validation, private readonly addSurvey: AddSurvey){}

    async handle(request: AddSurveyController.Request): Promise<HttpResponse>{
        try{
            const error = this.validation.validate(request)

            if(error) return badRequest(error)

            const { question, answers } = request

            await this.addSurvey.add({ question, answers, date: new Date() })

            return noContent()
        } catch(error){
            return serverError(error as Error);
        }
    }
}

export namespace AddSurveyController{
    export type Request = {
        question: string
        answers: SurveyAnswersModel
    }
}
