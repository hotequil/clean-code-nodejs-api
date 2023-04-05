import { ObjectId } from "mongodb";
import { LoadSurveyResult } from "@/domain/use-cases/survey-result/load-survey-result";

export interface LoadSurveyResultRepository{
    loadBySurveyId: (surveyId: string | ObjectId, accountId: string | ObjectId) => Promise<LoadSurveyResultRepository.Result>
}

export namespace LoadSurveyResultRepository{
    export type Result = LoadSurveyResult.Result
}
