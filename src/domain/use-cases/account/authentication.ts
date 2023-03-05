import { AuthenticationModel } from "@/domain/models/authentication";

export type AuthenticationParams = {
    email: string
    password: string
}

export interface Authentication {
    auth: (model: AuthenticationParams) => Promise<AuthenticationModel|null>
}
