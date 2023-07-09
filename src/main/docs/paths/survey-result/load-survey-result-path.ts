import { SwaggerTags } from "@/utils/enums";
import StatusCode from "status-code-enum";

export const loadSurveyResultPath = {
    get: {
        summary: "Load a survey result",
        tags: [SwaggerTags.SURVEY_RESULT],
        security: [
            {
                apiKeyAuth: []
            }
        ],
        parameters: [
            {
                in: "path",
                name: "surveyId",
                description: "The id from a survey",
                required: true,
                schema: {
                    type: "string"
                }
            }
        ],
        responses: {
            [StatusCode.SuccessOK]: {
                description: "Ok",
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/schemas/surveyResult"
                        }
                    }
                }
            },
            [StatusCode.ClientErrorForbidden]: {
                $ref: "#/components/forbidden"
            },
            [StatusCode.ClientErrorNotFound]: {
                $ref: "#/components/notFound"
            },
            [StatusCode.ServerErrorInternal]: {
                $ref: "#/components/serverError"
            }
        }
    }
}
