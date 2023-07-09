import { SwaggerTags } from "@/utils/enums";
import StatusCode from "status-code-enum";

export const addSurveyPath = {
    post: {
        summary: "Create a new survey",
        tags: [SwaggerTags.SURVEY],
        security: [
            {
                apiKeyAuth: []
            }
        ],
        requestBody: {
            description: "Body",
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/schemas/addSurvey"
                    }
                }
            }
        },
        responses: {
            [StatusCode.SuccessNoContent]: {
                description: "Ok (no content)"
            },
            [StatusCode.ClientErrorBadRequest]: {
                $ref: "#/components/badRequest"
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
