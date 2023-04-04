import { ObjectId } from "mongodb";
import { SurveyModel } from "@/domain/models/survey";

export interface LoadSurveyByIdRepository{
    loadById: (id: string | ObjectId) => Promise<LoadSurveyByIdRepository.Result>
}

export namespace LoadSurveyByIdRepository {
    export type Result = SurveyModel | null
}
