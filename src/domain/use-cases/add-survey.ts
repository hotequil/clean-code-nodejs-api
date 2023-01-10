import { SurveyAnswersModel } from "../models/survey";

export type AddSurveyModel = {
    question: string
    answers: SurveyAnswersModel
    date: Date
}

export interface AddSurvey{
    add: (model: AddSurveyModel) => Promise<null>
}
