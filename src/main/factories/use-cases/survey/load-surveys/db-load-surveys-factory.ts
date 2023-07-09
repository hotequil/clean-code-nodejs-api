import { type LoadSurveys } from "@/domain/use-cases/survey/load-surveys";
import { DbLoadSurveys } from "@/data/use-cases/survey/load-surveys/db-load-surveys";
import { SurveyMongoRepository } from "@/infra/db/mongodb/survey/survey-mongo-repository";

export const makeDbLoadSurveys = (): LoadSurveys => {
    const repository = new SurveyMongoRepository()

    return new DbLoadSurveys(repository)
}
