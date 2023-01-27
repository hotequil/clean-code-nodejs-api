import StatusCode from "status-code-enum";
import { SwaggerTags } from "@/utils/enums";

export const signUpPath = {
    post: {
        summary: "Create a new user",
        tags: [SwaggerTags.ACCOUNT],
        requestBody: {
            description: "Body",
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/schemas/signUp"
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
