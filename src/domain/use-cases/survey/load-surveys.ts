import { SurveysModel } from "../../models/survey";

export interface LoadSurveys{
    load: (accountId: string) => Promise<SurveysModel>
}
