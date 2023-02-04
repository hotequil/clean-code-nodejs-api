import { Router } from "express"
import { adaptRoute } from "../adapters/express-route-adapter"
import { defaultAuth } from "../middlewares";
import { makeSaveSurveyResultController } from "@/main/factories/controllers/survey-result/save-survey-result/save-survey-result-controller-factory";
import { makeLoadSurveyResultController } from "@/main/factories/controllers/survey-result/load-survey-result/load-survey-result-controller-factory";

export default (router: Router): void => {
    router.put("/surveys/:surveyId/results", defaultAuth, adaptRoute(makeSaveSurveyResultController()));
    router.get("/surveys/:surveyId/results", defaultAuth, adaptRoute(makeLoadSurveyResultController()));
};
