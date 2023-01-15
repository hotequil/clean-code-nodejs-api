import { AddSurveyRepository } from "@/data/protocols/db/survey/add-survey-repository";
import { AddSurveyModel } from "@/domain/use-cases/add-survey";
import { MongodbHelper } from "../helpers/mongodb-helper";
import { LoadSurveysRepository } from "@/data/protocols/db/survey/load-surveys-repository";
import { SurveyModel, SurveysModel } from "@/domain/models/survey";
import { Collection } from "mongodb";
import { LoadSurveyById } from "@/domain/use-cases/load-survey-by-id";

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyById{
    async add(model: AddSurveyModel): Promise<null>{
        const collection = await MongodbHelper.collection("surveys")

        await collection.insertOne(model)

        return null
    }

    async loadAll(): Promise<SurveysModel> {
        const collection = await MongodbHelper.collection("surveys") as unknown as Collection<SurveyModel>

        return await collection.find().toArray();
    }

    async loadById(id: Object): Promise<SurveyModel | null> {
        const collection = await MongodbHelper.collection("surveys")
        const response = await collection.findOne({ _id: id }) as unknown

        return response ? MongodbHelper.map<SurveyModel>(response) : null;
    }
}
