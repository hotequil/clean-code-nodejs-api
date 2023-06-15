import { Express } from "express";
import { ApolloServer } from "apollo-server-express";
import typeDefs from "@/main/graphql/type-defs";
import resolvers from "@/main/graphql/resolvers";
import { GraphQLError } from "graphql";
import StatusCode from "status-code-enum";

type GraphQLErrors = readonly GraphQLError[]

const hasGraphQLError = (errorName: string, errors: GraphQLErrors): boolean =>
    !!errors?.some(({ name, originalError }) => name === errorName || originalError?.name === errorName)

const applyGraphQLErrorResponse = (statusCode: StatusCode, response: any): void => {
    response.data = null
    response.http.status = statusCode
}

export default async (app: Express): Promise<void> => {
    const apolloServer = new ApolloServer({
        resolvers,
        typeDefs,
        plugins: [
            {
                // @ts-ignore
                requestDidStart: () => ({
                    willSendResponse: ({ response, errors }: { response: any, errors: GraphQLErrors }) => {
                        if(hasGraphQLError("UserInputError", errors)) applyGraphQLErrorResponse(StatusCode.ClientErrorBadRequest, response)
                        else if(hasGraphQLError("AuthenticationError", errors)) applyGraphQLErrorResponse(StatusCode.ClientErrorUnauthorized, response)
                        else if(hasGraphQLError("ForbiddenError", errors)) applyGraphQLErrorResponse(StatusCode.ClientErrorForbidden, response)
                        else if(hasGraphQLError("ApolloError", errors)) applyGraphQLErrorResponse(StatusCode.ServerErrorInternal, response)
                    }
                })
            }
        ]
    })

    await apolloServer.start();

    apolloServer.applyMiddleware({ app })
};
