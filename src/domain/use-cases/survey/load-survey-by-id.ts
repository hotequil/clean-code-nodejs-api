import { SurveyModel } from "@/domain/models/survey";

export interface LoadSurveyById{
    loadById: (id: string | Object) => Promise<SurveyModel | null>
}
