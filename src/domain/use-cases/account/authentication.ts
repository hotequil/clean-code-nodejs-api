export type AuthenticationParams = {
    email: string
    password: string
}

export interface Authentication {
    auth: (model: AuthenticationParams) => Promise<string|null>
}
