import { SwaggerTags } from "@/utils/enums";
import StatusCode from "status-code-enum";

export const saveSurveyResultPath = {
    put: {
        summary: "Create or update a survey result",
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
                },
            }
        ],
        requestBody: {
            description: "Body",
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/schemas/saveSurveyResult"
                    }
                }
            }
        },
        responses: {
            [StatusCode.SuccessOK]: {
                description: "Ok"
            },
            [StatusCode.ClientErrorForbidden]: {
                $ref: "#/components/forbidden"
            },
            [StatusCode.ClientErrorNotFound]: {
                $ref: "#/components/notFound"
            },
            [StatusCode.ServerErrorInternal]: {
                $ref: "#/components/serverError"
            },
        }
    }
}
