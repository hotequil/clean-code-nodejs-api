import { LoadAnswersBySurvey } from "@/domain/use-cases/survey/load-answers-by-survey";
import { SurveyMongoRepository } from "@/infra/db/mongodb/survey/survey-mongo-repository";
import { DbLoadAnswersBySurvey } from "@/data/use-cases/survey/load-answers-by-survey/db-load-answers-by-survey";

export const makeDbLoadAnswersBySurvey = (): LoadAnswersBySurvey =>
    new DbLoadAnswersBySurvey(new SurveyMongoRepository())
