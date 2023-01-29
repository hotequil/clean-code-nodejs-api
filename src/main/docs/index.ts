// @ts-ignore
import { version, description, name } from "../../../package.json"
import { addSurveyPath, loadSurveysPath, loginPath, signUpPath, saveSurveyResultPath } from "./paths";
import { accountSchema } from "@/main/docs/schemas/account-schema";
import { loginSchema } from "@/main/docs/schemas/login-schema";
import { errorSchema } from "@/main/docs/schemas/error-schema";
import { badRequestComponent, serverErrorComponent, unauthorizedComponent, notFoundComponent, forbiddenComponent } from "./components";
import { SwaggerTags } from "@/utils/enums";
import { surveysSchema } from "@/main/docs/schemas/surveys-schema";
import { surveySchema } from "@/main/docs/schemas/survey-schema";
import { surveyAnswerSchema } from "@/main/docs/schemas/survey-answer-schema";
import { apiKeyAuthSchema } from "@/main/docs/schemas/api-key-auth-schema";
import { signUpSchema } from "@/main/docs/schemas/sign-up-schema";
import { addSurveySchema } from "@/main/docs/schemas/add-survey-schema";
import { saveSurveyResultSchema } from "@/main/docs/schemas/save-survey-result-schema";
import { surveyResultSchema } from "@/main/docs/schemas/survey-result-schema";
import { surveyAnswerResultSchema } from "@/main/docs/schemas/survey-answer-result-schema";

export default {
    openapi: "3.0.0",
    info: {
        title: name,
        description,
        version,
    },
    license: {
        name: "CC0 1.0 Universal",
        url: "https://creativecommons.org/publicdomain/zero/1.0",
    },
    servers: [
        {
            url: "/api"
        },
    ],
    tags: [
        {
            name: SwaggerTags.ACCOUNT
        },
        {
            name: SwaggerTags.SURVEY
        },
        {
            name: SwaggerTags.SURVEY_RESULT
        },
    ],
    paths: {
        "/login": loginPath,
        "/surveys": {
            ...loadSurveysPath,
            ...addSurveyPath,
        },
        "/sign-up": signUpPath,
        "/surveys/{surveyId}/results": saveSurveyResultPath,
    },
    schemas: {
        account: accountSchema,
        login: loginSchema,
        error: errorSchema,
        surveyAnswer: surveyAnswerSchema,
        survey: surveySchema,
        surveys: surveysSchema,
        signUp: signUpSchema,
        addSurvey: addSurveySchema,
        saveSurveyResult: saveSurveyResultSchema,
        surveyResult: surveyResultSchema,
        surveyAnswerResult: surveyAnswerResultSchema,
    },
    components: {
        securitySchemes: {
            apiKeyAuth: apiKeyAuthSchema
        },
        badRequest: badRequestComponent,
        serverError: serverErrorComponent,
        unauthorized: unauthorizedComponent,
        notFound: notFoundComponent,
        forbidden: forbiddenComponent,
    },
}
