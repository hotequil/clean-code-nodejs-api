import { Controller } from "@/presentation/protocols";
import { makeLogDecorator } from "../../../decorators/log/log-decorator-factory";
import { SaveSurveyResultController } from "@/presentation/controllers/survey-result/save-survey-result/save-survey-result-controller";
import { makeDbSaveSurveyResult } from "@/main/factories/use-cases/survey-result/save-survey-result/db-save-survey-result-factory";
import { makeDbLoadSurveyById } from "@/main/factories/use-cases/survey/load-survey-by-id/db-load-survey-by-id-factory";

export const makeSaveSurveyResultController = (): Controller =>
    makeLogDecorator(new SaveSurveyResultController(makeDbLoadSurveyById(), makeDbSaveSurveyResult()))
