type SurveyAnswerModel = {
    answer: string
    image?: string
}

type SurveyAnswersModel = SurveyAnswerModel[]

export type SurveyModel = {
    id: string
    question: string
    answers: SurveyAnswersModel
    date: Date
}

export type SurveysModel = SurveyModel[]
