import { type SurveyResultModel } from "@/domain/models/survey-result";
import { MongodbHelper, QueryBuilderHelper } from "@/infra/db/mongodb/helpers";
import { ObjectId } from "mongodb";
import { type LoadSurveyResultRepository } from "@/data/protocols/db/survey-result/load-survey-result-repository";
import { type SaveSurveyResultRepository } from "@/data/protocols/db/survey-result/save-survey-result-repository";

export class SurveyResultMongoRepository implements SaveSurveyResultRepository, LoadSurveyResultRepository {
    async save(data: SaveSurveyResultRepository.Params): Promise<void> {
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
    }

    async loadBySurveyId(surveyId: ObjectId | string, accountId: ObjectId | string): Promise<LoadSurveyResultRepository.Result> {
        const collection = await MongodbHelper.collection("surveyResults")
        const query = new QueryBuilderHelper().match({
                                                  surveyId: typeof (surveyId) === "string" ? new ObjectId(surveyId) : surveyId
                                              })
                                              .group({
                                                  _id: 0,
                                                  data: {
                                                      $push: "$$ROOT"
                                                  },
                                                  total: {
                                                      $sum: 1
                                                  }
                                              })
                                              .unwind({
                                                  path: "$data"
                                              })
                                              .lookup({
                                                  from: "surveys",
                                                  foreignField: "_id",
                                                  localField: "data.surveyId",
                                                  as: "survey"
                                              })
                                              .unwind({
                                                  path: "$survey"
                                              })
                                              .group({
                                                  _id: {
                                                      surveyId: "$survey._id",
                                                      question: "$survey.question",
                                                      date: "$survey.date",
                                                      total: "$total",
                                                      answer: "$data.answer",
                                                      answers: "$survey.answers"
                                                  },
                                                  count: {
                                                      $sum: 1
                                                  },
                                                  currentAccountAnswer: {
                                                      $push: {
                                                          $cond: [
                                                              {
                                                                  $eq: [
                                                                      "$data.accountId",
                                                                      typeof (accountId) === "string" ? new ObjectId(accountId) : accountId
                                                                  ]
                                                              },
                                                              "$data.answer",
                                                              null
                                                          ]
                                                      }
                                                  }
                                              })
                                              .project({
                                                  _id: 0,
                                                  surveyId: "$_id.surveyId",
                                                  question: "$_id.question",
                                                  date: "$_id.date",
                                                  answers: {
                                                      $map: {
                                                          input: "$_id.answers",
                                                          as: "item",
                                                          in: {
                                                              $mergeObjects: [
                                                                  "$$item",
                                                                  {
                                                                      count: {
                                                                          $cond: {
                                                                              if: {
                                                                                  $eq: ["$$item.answer", "$_id.answer"]
                                                                              },
                                                                              then: "$count",
                                                                              else: 0
                                                                          }
                                                                      },
                                                                      percent: {
                                                                          $cond: {
                                                                              if: {
                                                                                  $eq: ["$$item.answer", "$_id.answer"]
                                                                              },
                                                                              then: {
                                                                                  $multiply: [
                                                                                      { $divide: ["$count", "$_id.total"] },
                                                                                      100
                                                                                  ]
                                                                              },
                                                                              else: 0
                                                                          }
                                                                      },
                                                                      isCurrentAccountAnswer: {
                                                                          $eq: [
                                                                              "$$item.answer",
                                                                              { $arrayElemAt: ["$currentAccountAnswer", 0] }
                                                                          ]
                                                                      }
                                                                  }
                                                              ]
                                                          }
                                                      }
                                                  }
                                              })
                                              .group({
                                                  _id: {
                                                      surveyId: "$surveyId",
                                                      question: "$question",
                                                      date: "$date"
                                                  },
                                                  answers: {
                                                      $push: "$answers"
                                                  }
                                              })
                                              .project({
                                                  _id: 0,
                                                  surveyId: "$_id.surveyId",
                                                  question: "$_id.question",
                                                  date: "$_id.date",
                                                  answers: {
                                                      $reduce: {
                                                          input: "$answers",
                                                          initialValue: [],
                                                          in: {
                                                              $concatArrays: ["$$value", "$$this"]
                                                          }
                                                      }
                                                  }
                                              })
                                              .unwind({
                                                  path: "$answers"
                                              })
                                              .group({
                                                  _id: {
                                                      surveyId: "$surveyId",
                                                      question: "$question",
                                                      date: "$date",
                                                      answer: "$answers.answer",
                                                      image: "$answers.image",
                                                      isCurrentAccountAnswer: "$answers.isCurrentAccountAnswer"
                                                  },
                                                  count: {
                                                      $sum: "$answers.count"
                                                  },
                                                  percent: {
                                                      $sum: "$answers.percent"
                                                  }
                                              })
                                              .project({
                                                  _id: 0,
                                                  surveyId: "$_id.surveyId",
                                                  question: "$_id.question",
                                                  date: "$_id.date",
                                                  answer: {
                                                      answer: "$_id.answer",
                                                      image: "$_id.image",
                                                      count: { $multiply: [{ $trunc: { $multiply: ["$count", 100] } }, 0.01] },
                                                      percent: { $multiply: [{ $trunc: { $multiply: ["$percent", 100] } }, 0.01] },
                                                      isCurrentAccountAnswer: "$_id.isCurrentAccountAnswer"
                                                  }
                                              })
                                              .sort({
                                                  "answer.count": -1
                                              })
                                              .group({
                                                  _id: {
                                                      surveyId: "$surveyId",
                                                      question: "$question",
                                                      date: "$date"
                                                  },
                                                  answers: {
                                                      $push: "$answer"
                                                  }
                                              })
                                              .project({
                                                  _id: 0,
                                                  surveyId: "$_id.surveyId",
                                                  question: "$_id.question",
                                                  date: "$_id.date",
                                                  answers: "$answers"
                                              })
                                              .build()

        const [result] = await collection.aggregate<SurveyResultModel>(query).toArray()

        return result || null
    }
}
