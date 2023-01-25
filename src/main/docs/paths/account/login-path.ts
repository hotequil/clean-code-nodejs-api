import StatusCode from "status-code-enum";
import { SwaggerTags } from "@/utils/enums";

export const loginPath = {
    post: {
        summary: "Authenticate user",
        tags: [SwaggerTags.ACCOUNT],
        requestBody: {
            description: "Body",
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/schemas/login"
                    }
                }
            }
        },
        responses: {
            [StatusCode.SuccessOK]: {
                description: "Ok",
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/schemas/account"
                        }
                    }
                }
            },
            [StatusCode.ClientErrorBadRequest]: {
                $ref: "#/components/badRequest"
            },
            [StatusCode.ClientErrorUnauthorized]: {
                $ref: "#/components/unauthorized"
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
