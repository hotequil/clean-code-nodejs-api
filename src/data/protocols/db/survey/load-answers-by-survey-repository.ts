import { type ObjectId } from "mongodb";

export interface LoadAnswersBySurveyRepository {
    loadAnswers: (id: string | ObjectId) => Promise<LoadAnswersBySurveyRepository.Result>
}

export namespace LoadAnswersBySurveyRepository {
    export type Result = string[]
}
