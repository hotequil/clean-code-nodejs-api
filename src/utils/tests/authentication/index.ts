import { Authentication, AuthenticationParams } from "@/domain/use-cases/account/authentication";

export const mockAuthentication = (result: string): Authentication => {
    class AuthenticationStub implements Authentication {
        async auth (params: AuthenticationParams): Promise<string | null> {
            console.log(params)

            return await new Promise(resolve => resolve(result))
        }
    }

    return new AuthenticationStub()
}