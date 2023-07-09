import express, { type Express } from "express";
import apolloServer from "@/main/config/apollo-server";

export const makeApp = async (): Promise<Express> => {
    const app = express()

    await apolloServer(app)

    return app
}
