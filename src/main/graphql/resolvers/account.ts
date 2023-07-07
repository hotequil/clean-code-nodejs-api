import { makeLoginController } from "@/main/factories/controllers/account/login/login-controller-factory";
import { adaptResolver } from "@/main/adapters/apollo-server-resolver-adapter";
import { makeSignUpController } from "@/main/factories/controllers/account/sign-up/sign-up-controller-factory";

const convertResponseToAccount = ({ token }: any): { accessToken: string, name: string } => ({
    accessToken: token.token,
    name: token.name,
})

export default {
    Query: {
        login: async (parent: any, args: any, context: any) =>
            convertResponseToAccount(await adaptResolver(makeLoginController(), args, context))
    },
    Mutation: {
        signUp: async (parent: any, args: any, context: any) =>
            convertResponseToAccount(await adaptResolver(makeSignUpController(), args, context))
    }
}
