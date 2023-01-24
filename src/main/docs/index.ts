// @ts-ignore
import { version, description, name } from "../../../package.json"
import { loginPath } from "@/main/docs/paths/account/login-path";
import { Tags } from "@/main/docs/tags";
import { accountSchema } from "@/main/docs/schemas/account-schema";
import { loginSchema } from "@/main/docs/schemas/login-schema";

export default {
    openapi: "3.0.0",
    info: {
        title: name,
        description,
        version,
    },
    servers: [
        {
            url: "/api"
        },
    ],
    tags: [
        {
            name: Tags.ACCOUNT
        },
    ],
    paths: {
        "/login": loginPath
    },
    schemas: {
        account: accountSchema,
        login: loginSchema,
    },
}
