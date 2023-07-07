import { DbCheckSurveyById } from "@/data/use-cases/survey/check-survey-by-id/db-check-survey-by-id";
import { CheckSurveyById } from "@/domain/use-cases/survey/check-survey-by-id";
import { SurveyMongoRepository } from "@/infra/db/mongodb/survey/survey-mongo-repository";

export const makeDbCheckSurveyById = (): CheckSurveyById => new DbCheckSurveyById(new SurveyMongoRepository())
