import { Authentication, AuthenticationParams } from "@/domain/use-cases/account/authentication";
import { AuthenticationModel } from "@/domain/models/authentication";

export const mockAuthentication = (token: string, name: string): Authentication => {
    class AuthenticationStub implements Authentication {
        async auth (params: AuthenticationParams): Promise<AuthenticationModel | null> {
            console.log(params)

            return { token, name };
        }
    }

    return new AuthenticationStub()
}
