import { AddSurveyRepository } from "../../../../data/protocols/db/survey/add-survey-repository";
import { AddSurveyModel } from "../../../../domain/use-cases/add-survey";
import { MongodbHelper } from "../helpers/mongodb-helper";
import { LoadSurveysRepository } from "../../../../data/protocols/db/survey/load-surveys-repository";
import { SurveyModel, SurveysModel } from "../../../../domain/models/survey";
import { Collection } from "mongodb";

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository{
    async add(model: AddSurveyModel): Promise<null>{
        const collection = await MongodbHelper.collection("surveys")

        await collection.insertOne(model)

        return null
    }

    async loadAll(): Promise<SurveysModel> {
        const collection = await MongodbHelper.collection("surveys") as unknown as Collection<SurveyModel>

        return await collection.find().toArray();
    }
}
