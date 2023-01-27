import { SwaggerTags } from "@/utils/enums";
import StatusCode from "status-code-enum";

export const loadSurveysPath = {
    get: {
        summary: "Load all surveys",
        tags: [SwaggerTags.SURVEY],
        security: [
            {
                apiKeyAuth: []
            }
        ],
        responses: {
            [StatusCode.SuccessOK]: {
                description: "Ok",
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/schemas/surveys"
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
            },
        }
    }
}
