import { Controller } from "@/presentation/protocols";
import { ApolloError, AuthenticationError, ForbiddenError, UserInputError } from "apollo-server-express";
import StatusCode from "status-code-enum";

export const adaptResolver = async(controller: Controller, args: any): Promise<any> => {
    const { body, statusCode } = await controller.handle(args)

    switch (statusCode) {
        case StatusCode.SuccessOK:
        case StatusCode.SuccessCreated:
        case StatusCode.SuccessNoContent: return body
        case StatusCode.ClientErrorBadRequest: throw new UserInputError(body.message)
        case StatusCode.ClientErrorUnauthorized: throw new AuthenticationError(body.message)
        case StatusCode.ClientErrorForbidden: throw new ForbiddenError(body.message)
        default: throw new ApolloError(body.message)
    }
}
