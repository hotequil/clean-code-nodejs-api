import { Controller } from "../../../../../presentation/protocols";
import { makeLogDecorator } from "../../../decorators/log/log-decorator-factory";
import { LoadSurveysController } from "../../../../../presentation/controllers/survey/load-surveys/load-surveys-controller";
import { makeDbLoadSurveys } from "../../../use-cases/survey/load-surveys/db-load-surveys-factory";

export const makeLoadSurveysController = (): Controller =>
    makeLogDecorator(new LoadSurveysController(makeDbLoadSurveys()))
