import { AddSurveyModel } from "@/domain/use-cases/survey/add-survey";

export interface AddSurveyRepository{
    add: (model: AddSurveyModel) => Promise<null>
}
