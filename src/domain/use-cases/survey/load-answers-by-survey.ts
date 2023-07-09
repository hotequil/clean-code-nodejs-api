import { type ObjectId } from "mongodb";

export interface LoadAnswersBySurvey {
    loadAnswers: (id: string | ObjectId) => Promise<LoadAnswersBySurvey.Result>
}

export namespace LoadAnswersBySurvey{
    export type Result = string[]
}
