import { Tags } from "@/main/docs/tags";
import StatusCode from "status-code-enum";

export const loginPath = {
    post: {
        summary: "Authenticate user",
        tags: [Tags.ACCOUNT],
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
                description: "Success",
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/schemas/account"
                        }
                    }
                }
            },
        }
    }
}
