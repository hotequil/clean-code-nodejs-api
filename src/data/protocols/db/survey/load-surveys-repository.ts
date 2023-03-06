import { SurveysModel } from "@/domain/models/survey";
import { ObjectId } from "mongodb";

export interface LoadSurveysRepository{
    loadAll: (accountId: string | ObjectId) => Promise<SurveysModel>
}
