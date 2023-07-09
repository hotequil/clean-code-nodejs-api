import { type Router } from "express"
import { adaptRoute } from "../adapters/express-route-adapter"
import { makeAddSurveyController } from "../factories/controllers/survey/add-survey/add-survey-controller-factory"
import { makeLoadSurveysController } from "../factories/controllers/survey/load-surveys/load-surveys-controller-factory";
import { adminAuth, defaultAuth } from "../middlewares";

export default (router: Router): void => {
    router.post("/surveys", adminAuth, adaptRoute(makeAddSurveyController()));
    router.get("/surveys", defaultAuth, adaptRoute(makeLoadSurveysController()));
};
