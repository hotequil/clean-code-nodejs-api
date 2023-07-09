import { type Authentication } from "@/domain/use-cases/account/authentication";

export const mockAuthentication = (token: string, name: string): Authentication => {
    class AuthenticationStub implements Authentication {
        async auth (params: Authentication.Params): Promise<Authentication.Result> {
            console.log(params)

            return { token, name };
        }
    }

    return new AuthenticationStub()
}
