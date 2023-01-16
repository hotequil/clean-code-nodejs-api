import { SurveyModel } from "../../models/survey";

export type AddSurveyModel = Omit<SurveyModel, "id">

export interface AddSurvey{
    add: (model: AddSurveyModel) => Promise<null>
}
