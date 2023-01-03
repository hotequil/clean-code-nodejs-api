type Answer = {
    image: string
    answer: string
}

export type AddSurveyModel = {
    question: string
    answers: Answer[]
}

export interface AddSurvey{
    add: (model: AddSurveyModel) => Promise<null>
}
