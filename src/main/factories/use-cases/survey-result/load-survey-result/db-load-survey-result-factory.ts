import { SurveyResultMongoRepository } from "@/infra/db/mongodb/survey-result/survey-result-mongo-repository";
import { type LoadSurveyResult } from "@/domain/use-cases/survey-result/load-survey-result";
import { DbLoadSurveyResult } from "@/data/use-cases/survey-result/load-survey-result/db-load-survey-result";
import { SurveyMongoRepository } from "@/infra/db/mongodb/survey/survey-mongo-repository";

export const makeDbLoadSurveyResult = (): LoadSurveyResult =>
    new DbLoadSurveyResult(new SurveyResultMongoRepository(), new SurveyMongoRepository())
