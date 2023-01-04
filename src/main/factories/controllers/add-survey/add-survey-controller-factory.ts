import { Controller } from "../../../../presentation/protocols";
import { makeLogDecorator } from "../../use-cases/decorators/log-decorator-factory";
import { AddSurveyController } from "../../../../presentation/controllers/survey/add-survey/add-survey-controller";
import { makeAddSurveyValidationComposite } from "./add-survey-validation-factory";
import { makeDbAddSurvey } from "../../use-cases/add-survey/db-add-survey-factory";

export const makeAddSurveyController = (): Controller =>
    makeLogDecorator(new AddSurveyController(makeAddSurveyValidationComposite(), makeDbAddSurvey()))
