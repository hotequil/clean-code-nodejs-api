import { SaveSurveyResult, SaveSurveyResultParams } from "@/domain/use-cases/survey-result/save-survey-result";
import { SurveyResultModel } from "@/domain/models/survey-result";
import { MongodbHelper } from "@/infra/db/mongodb/helpers/mongodb-helper";
import { ObjectId } from "mongodb";

export class SurveyResultMongoRepository implements SaveSurveyResult{
    async save(data: SaveSurveyResultParams): Promise<SurveyResultModel | null> {
        const collection = await MongodbHelper.collection("surveyResults")
        const { answer, date } = data
        let { surveyId, accountId } = data

        surveyId = typeof (surveyId) === "string" ? new ObjectId(surveyId) : surveyId
        accountId = typeof (accountId) === "string" ? new ObjectId(accountId) : accountId

        await collection.findOneAndUpdate(
            { surveyId, accountId },
            { $set: { answer, date } },
            { upsert: true }
        )

        return await this.loadBySurveyId(surveyId);
    }

    private async loadBySurveyId(surveyId: Object): Promise<SurveyResultModel | null>{
        const collection = await MongodbHelper.collection("surveyResults")
        const query = collection.aggregate<SurveyResultModel>([
            {
                $match: { surveyId }
            },
            {
                $group: {
                    _id: 0,
                    data: {
                        $push: "$$ROOT"
                    },
                    count: {
                        $sum: 1
                    }
                }
            },
            {
                $unwind: {
                    path: "$data"
                }
            },
            {
                $lookup: {
                    from: "surveys",
                    foreignField: "_id",
                    localField: "data.surveyId",
                    as: "survey"
                }
            },
            {
                $unwind: {
                    path: "$survey"
                }
            },
            {
                $group: {
                    _id: {
                        surveyId: "$survey._id",
                        question: "$survey.question",
                        date: "$survey.date",
                        total: "$count",
                        answer: {
                            $filter: {
                                input: "$survey.answers",
                                as: "item",
                                cond: {
                                    $eq: ["$$item.answer", "$data.answer"]
                                }
                            }
                        }
                    },
                    count: {
                        $sum: 1
                    }
                }
            },
            {
                $unwind: {
                    path: "$_id.answer"
                }
            },
            {
                $addFields: {
                    "_id.answer.count": "$count",
                    "_id.answer.percent": {
                        $multiply: [
                            { $divide: ["$count", "$_id.total"] },
                            100
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: {
                        surveyId: "$_id.surveyId",
                        question: "$_id.question",
                        date: "$_id.date"
                    },
                    answers: {
                        $push: "$_id.answer"
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    surveyId: "$_id.surveyId",
                    question: "$_id.question",
                    date: "$_id.date",
                    answers: "$answers"
                }
            }
        ])

        const results = await query.toArray()

        return results?.length ? results[0] : null
    }
}
