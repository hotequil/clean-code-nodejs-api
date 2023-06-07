import { makeLoginController } from "@/main/factories/controllers/account/login/login-controller-factory";
import { adaptResolver } from "@/main/adapters/apollo-server-resolver-adapter";

export default {
    Query: {
        login: async (parent: any, args: any) => {
            const { token } = await adaptResolver(makeLoginController(), args)

            return {
                accessToken: token.token,
                name: token.name,
            }
        }
    }
}
