import { SurveyResultModel } from "@/domain/models/survey-result";

export type SaveSurveyResultParams = {
    surveyId: string | Object
    accountId: string | Object
    answer: string
    date: Date
}

export interface SaveSurveyResult{
    save: (data: SaveSurveyResultParams) => Promise<SurveyResultModel | null>
}
