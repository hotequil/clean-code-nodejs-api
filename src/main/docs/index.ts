// @ts-ignore
import { version, description, name } from "../../../package.json"
import { loginPath } from "./paths";
import { accountSchema } from "@/main/docs/schemas/account-schema";
import { loginSchema } from "@/main/docs/schemas/login-schema";
import { errorSchema } from "@/main/docs/schemas/error-schema";
import { badRequestComponent, serverErrorComponent, unauthorizedComponent, notFoundComponent } from "./components";
import { SwaggerTags } from "@/utils/enums";

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
    ],
    paths: {
        "/login": loginPath
    },
    schemas: {
        account: accountSchema,
        login: loginSchema,
        error: errorSchema,
    },
    components: {
        badRequest: badRequestComponent,
        serverError: serverErrorComponent,
        unauthorized: unauthorizedComponent,
        notFound: notFoundComponent,
    },
}
