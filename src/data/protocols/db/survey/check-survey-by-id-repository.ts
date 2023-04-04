import { ObjectId } from "mongodb";
import { CheckSurveyById } from "@/domain/use-cases/survey/check-survey-by-id";

export interface CheckSurveyByIdRepository{
    checkById: (id: string | ObjectId) => Promise<CheckSurveyByIdRepository.Result>
}

export namespace CheckSurveyByIdRepository {
    export type Result = CheckSurveyById.Result
}
