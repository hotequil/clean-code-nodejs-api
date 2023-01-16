import { SaveSurveyResult, SaveSurveyResultModel } from "@/domain/use-cases/survey-result/save-survey-result";
import { SurveyResultModel } from "@/domain/models/survey-result";
import { MongodbHelper } from "@/infra/db/mongodb/helpers/mongodb-helper";

export class SurveyResultMongoRepository implements SaveSurveyResult{
    async save(data: SaveSurveyResultModel): Promise<SurveyResultModel | null> {
        const { surveyId, accountId, answer, date } = data
        const collection = await MongodbHelper.collection("surveyResults")
        const response = await collection.findOneAndUpdate({ surveyId, accountId }, { $set: { answer, date } }, { upsert: true, returnDocument: "after" })
        const { value } = response

        return value ? MongodbHelper.map<SurveyResultModel>(value) : null;
    }
}
