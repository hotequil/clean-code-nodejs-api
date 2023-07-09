import { DbAddSurvey } from "@/data/use-cases/survey/add-survey/db-add-survey"
import { SurveyMongoRepository } from "@/infra/db/mongodb/survey/survey-mongo-repository"
import { type AddSurvey } from "@/domain/use-cases/survey/add-survey"

export const makeDbAddSurvey = (): AddSurvey => {
    const repository = new SurveyMongoRepository()

    return new DbAddSurvey(repository)
}
