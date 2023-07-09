import { type Controller } from "@/presentation/protocols";
import { makeLogDecorator } from "../../../decorators/log/log-decorator-factory";
import { LoadSurveyResultController } from "@/presentation/controllers/survey-result/load-survey-result/load-survey-result-controller";
import { makeDbLoadSurveyResult } from "@/main/factories/use-cases/survey-result/load-survey-result/db-load-survey-result-factory";
import { makeDbCheckSurveyById } from "@/main/factories/use-cases/survey/check-survey-by-id/db-check-survey-by-id-factory";

export const makeLoadSurveyResultController = (): Controller =>
    makeLogDecorator(new LoadSurveyResultController(makeDbCheckSurveyById(), makeDbLoadSurveyResult()))
