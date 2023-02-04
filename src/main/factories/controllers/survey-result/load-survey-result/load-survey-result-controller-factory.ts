import { Controller } from "@/presentation/protocols";
import { makeLogDecorator } from "../../../decorators/log/log-decorator-factory";
import { makeDbLoadSurveyById } from "@/main/factories/use-cases/survey/load-survey-by-id/db-load-survey-by-id-factory";
import { LoadSurveyResultController } from "@/presentation/controllers/survey-result/load-survey-result/load-survey-result-controller";
import { makeDbLoadSurveyResult } from "@/main/factories/use-cases/survey-result/load-survey-result/db-load-survey-result-factory";

export const makeLoadSurveyResultController = (): Controller =>
    makeLogDecorator(new LoadSurveyResultController(makeDbLoadSurveyById(), makeDbLoadSurveyResult()))
