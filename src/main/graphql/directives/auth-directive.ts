import { getDirective, MapperKind, mapSchema } from "@graphql-tools/utils";
import { defaultFieldResolver, type GraphQLSchema } from "graphql";
import StatusCode from "status-code-enum";
import { makeAuthMiddleware } from "@/main/factories/middlewares/auth-middleware-factory";
import { ForbiddenError } from "apollo-server-express";

export const authDirectiveTransformer = (schema: GraphQLSchema): GraphQLSchema =>
    mapSchema(
        schema,
        {
            [MapperKind.OBJECT_FIELD]: fieldConfig => {
                const directive = getDirective(schema, fieldConfig, "auth")?.[0];

                if (directive) {
                    const { resolve = defaultFieldResolver } = fieldConfig;

                    fieldConfig.resolve = async (source, args, context, info) => {
                        const request = context?.req
                        const { statusCode, body } = await makeAuthMiddleware().handle(request?.headers || {});

                        if(statusCode === StatusCode.SuccessOK) {
                            Object.assign(request, body)

                            return resolve(source, args, context, info);
                        }

                        throw new ForbiddenError(body?.message)
                    };

                    return fieldConfig;
                }
            }
        }
    );
