import { ObjectId } from "mongodb";
import { LoadSurveyById } from "@/domain/use-cases/survey/load-survey-by-id";

export interface LoadSurveyByIdRepository{
    loadById: (id: string | ObjectId) => Promise<LoadSurveyByIdRepository.Result>
}

export namespace LoadSurveyByIdRepository {
    export type Result = LoadSurveyById.Result
}
