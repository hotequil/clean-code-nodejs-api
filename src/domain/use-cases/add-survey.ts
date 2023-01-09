type Answer = {
    answer: string
    image?: string
}

export type AddSurveyModel = {
    question: string
    answers: Answer[]
    date: Date
}

export interface AddSurvey{
    add: (model: AddSurveyModel) => Promise<null>
}
