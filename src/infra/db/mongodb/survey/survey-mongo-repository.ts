import { type AddSurveyRepository } from "@/data/protocols/db/survey/add-survey-repository";
import { MongodbHelper, QueryBuilderHelper } from "../helpers";
import { type LoadSurveysRepository } from "@/data/protocols/db/survey/load-surveys-repository";
import { type SurveyModel, type SurveysModel } from "@/domain/models/survey";
import { type Collection, ObjectId } from "mongodb";
import { type LoadSurveyByIdRepository } from "@/data/protocols/db/survey/load-survey-by-id-repository";
import { type CheckSurveyByIdRepository } from "@/data/protocols/db/survey/check-survey-by-id-repository";
import { type LoadAnswersBySurveyRepository } from "@/data/protocols/db/survey/load-answers-by-survey-repository";

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository, CheckSurveyByIdRepository, LoadAnswersBySurveyRepository {
    async add(model: AddSurveyRepository.Params): Promise<AddSurveyRepository.Result> {
        const collection = await MongodbHelper.collection("surveys")

        await collection.insertOne(model)

        return null
    }

    async loadAll(accountId: string | ObjectId): Promise<SurveysModel> {
        accountId = typeof (accountId) === "string" ? new ObjectId(accountId) : accountId

        const query = new QueryBuilderHelper().lookup({
                                                  from: "surveyResults",
                                                  foreignField: "surveyId",
                                                  localField: "_id",
                                                  as: "result"
                                              })
                                              .project({
                                                  _id: 1,
                                                  question: 1,
                                                  answers: 1,
                                                  date: 1,
                                                  didAnswer: {
                                                      $gte: [
                                                          {
                                                              $size: {
                                                                  $filter: {
                                                                      input: "$result",
                                                                      as: "item",
                                                                      cond: {
                                                                          $eq: ["$$item.accountId", accountId]
                                                                      }
                                                                  }
                                                              }
                                                          },
                                                          1
                                                      ]
                                                  }
                                              })
                                              .build()

        const collection = await MongodbHelper.collection("surveys") as unknown as Collection<SurveyModel>

        return MongodbHelper.mapAll<SurveyModel>(await collection.aggregate(query).toArray());
    }

    async loadById(id: ObjectId | string): Promise<LoadSurveyByIdRepository.Result> {
        const collection = await MongodbHelper.collection("surveys")
        const response = await collection.findOne({ _id: typeof id === "string" ? new ObjectId(id) : id }) as unknown

        return response ? MongodbHelper.map<SurveyModel>(response) : null;
    }

    async loadAnswers(id: ObjectId | string): Promise<LoadAnswersBySurveyRepository.Result> {
        const collection = await MongodbHelper.collection("surveys")

        const query = new QueryBuilderHelper().match({ _id: typeof id === "string" ? new ObjectId(id) : id })
                                              .project({
                                                  _id: 0,
                                                  answers: "$answers.answer"
                                              })
                                              .build()

        const surveys = await collection.aggregate(query).toArray()

        return surveys?.[0]?.answers || []
    }

    async checkById(id: ObjectId | string): Promise<CheckSurveyByIdRepository.Result> {
        const collection = await MongodbHelper.collection("surveys")

        const result = await collection.findOne(
            { _id: typeof id === "string" ? new ObjectId(id) : id },
            { projection: { _id: 1 } }
        )

        return !!result;
    }
}
