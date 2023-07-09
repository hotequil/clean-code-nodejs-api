import { type ObjectId } from "mongodb";

export interface CheckSurveyById {
    checkById: (id: string | ObjectId) => Promise<CheckSurveyById.Result>
}

export namespace CheckSurveyById{
    export type Result = boolean
}
