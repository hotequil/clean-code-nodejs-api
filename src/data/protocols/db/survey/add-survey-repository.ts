import { AddSurveyModel } from "../../../../domain/use-cases/add-survey";

export interface AddSurveyRepository{
    add: (model: AddSurveyModel) => Promise<null>
}
