import { SurveyModel } from "@/domain/models/survey";
import { ObjectId } from "mongodb";

export interface LoadSurveyById{
    loadById: (id: string | ObjectId) => Promise<SurveyModel | null>
}
