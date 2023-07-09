import { type ObjectId } from "mongodb";
import { type SurveyModel } from "@/domain/models/survey";

export interface LoadSurveyByIdRepository {
    loadById: (id: string | ObjectId) => Promise<LoadSurveyByIdRepository.Result>
}

export namespace LoadSurveyByIdRepository {
    export type Result = SurveyModel | null
}
