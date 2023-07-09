import { type SurveysModel } from "@/domain/models/survey";
import { type ObjectId } from "mongodb";

export interface LoadSurveysRepository {
    loadAll: (accountId: string | ObjectId) => Promise<SurveysModel>
}
