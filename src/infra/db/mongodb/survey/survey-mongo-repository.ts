import { AddSurveyRepository } from "../../../../data/protocols/db/survey/add-survey-repository";
import { AddSurveyModel } from "../../../../domain/use-cases/add-survey";
import { MongodbHelper } from "../helpers/mongodb-helper";

export class SurveyMongoRepository implements AddSurveyRepository{
    async add(model: AddSurveyModel): Promise<null>{
        const collection = await MongodbHelper.collection("surveys")

        await collection.insertOne(model)

        return null
    }
}
