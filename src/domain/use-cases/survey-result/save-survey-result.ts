import { type ObjectId } from "mongodb";
import { type SurveyResultModel } from "@/domain/models/survey-result";

export interface SaveSurveyResult {
    save: (data: SaveSurveyResult.Params) => Promise<SaveSurveyResult.Result>
}

export namespace SaveSurveyResult{
    export type Params = {
        surveyId: string | ObjectId
        accountId: string | ObjectId
        answer: string
        date: Date
    }

    export type Result = SurveyResultModel | null
}
