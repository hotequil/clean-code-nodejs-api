import { type AddSurvey } from "@/domain/use-cases/survey/add-survey";

export interface AddSurveyRepository {
    add: (model: AddSurveyRepository.Params) => Promise<AddSurveyRepository.Result>
}

export namespace AddSurveyRepository{
    export type Params = AddSurvey.Params
    export type Result = AddSurvey.Result
}
