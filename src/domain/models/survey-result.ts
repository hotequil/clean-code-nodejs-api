type SurveyAnswerResultModel = {
    answer: string
    count: number
    percent: number
    image?: string
}

export type SurveyAnswersResultModel = SurveyAnswerResultModel[]

export type SurveyResultModel = {
    surveyId: string | Object
    question: string
    answers: SurveyAnswersResultModel
    date: Date
}
