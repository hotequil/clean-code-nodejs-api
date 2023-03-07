import { ObjectId } from "mongodb";

type SurveyAnswerResultModel = {
    answer: string
    count: number
    percent: number
    isCurrentAccountAnswer: boolean
    image?: string
}

export type SurveyAnswersResultModel = SurveyAnswerResultModel[]

export type SurveyResultModel = {
    surveyId: string | ObjectId
    question: string
    answers: SurveyAnswersResultModel
    date: Date
}
