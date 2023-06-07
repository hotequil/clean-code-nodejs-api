import { Express } from "express";
import { ApolloServer } from "apollo-server-express";
import typeDefs from "@/main/graphql/type-defs";
import resolvers from "@/main/graphql/resolvers";

export default async (app: Express): Promise<void> => {
    const apolloServer = new ApolloServer({ resolvers, typeDefs })

    await apolloServer.start();

    apolloServer.applyMiddleware({ app })
};
