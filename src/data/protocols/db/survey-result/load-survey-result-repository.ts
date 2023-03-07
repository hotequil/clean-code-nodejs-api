import { SurveyResultModel } from "@/domain/models/survey-result";
import { ObjectId } from "mongodb";

export interface LoadSurveyResultRepository{
    loadBySurveyId: (surveyId: string | ObjectId, accountId: string | ObjectId) => Promise<SurveyResultModel | null>
}
