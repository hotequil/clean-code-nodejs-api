import { type Express } from "express";
import { serve, setup } from "swagger-ui-express";
import config from "@/main/docs"
import { noCache } from "@/main/middlewares/no-cache/no-cache";

export default (app: Express): void => {
    app.use("/docs", noCache, serve, setup(config));
};
