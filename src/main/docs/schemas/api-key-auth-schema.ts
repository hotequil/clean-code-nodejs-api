import { Header } from "@/utils/enums";

export const apiKeyAuthSchema = {
    type: "apiKey",
    in: "header",
    name: Header.X_ACCESS_TOKEN
}
