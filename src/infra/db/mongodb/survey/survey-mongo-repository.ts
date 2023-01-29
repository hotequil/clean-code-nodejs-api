import { AddSurveyRepository } from "@/data/protocols/db/survey/add-survey-repository";
import { AddSurveyParams } from "@/domain/use-cases/survey/add-survey";
import { MongodbHelper } from "../helpers";
import { LoadSurveysRepository } from "@/data/protocols/db/survey/load-surveys-repository";
import { SurveyModel, SurveysModel } from "@/domain/models/survey";
import { Collection, ObjectId } from "mongodb";
import { LoadSurveyById } from "@/domain/use-cases/survey/load-survey-by-id";

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyById{
    async add(model: AddSurveyParams): Promise<null>{
        const collection = await MongodbHelper.collection("surveys")

        await collection.insertOne(model)

        return null
    }

    async loadAll(): Promise<SurveysModel> {
        const collection = await MongodbHelper.collection("surveys") as unknown as Collection<SurveyModel>

        return MongodbHelper.mapAll<SurveyModel>(await collection.find().toArray());
    }

    async loadById(id: Object | string): Promise<SurveyModel | null> {
        const collection = await MongodbHelper.collection("surveys")
        const response = await collection.findOne({ _id: typeof id === "string" ? new ObjectId(id) : id }) as unknown

        return response ? MongodbHelper.map<SurveyModel>(response) : null;
    }
}
