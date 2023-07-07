import { SurveyModel } from "../../models/survey";

export interface AddSurvey{
    add: (model: AddSurvey.Params) => Promise<AddSurvey.Result>
}

export namespace AddSurvey{
    export type Params = Omit<SurveyModel, "id">
    export type Result = null
}
