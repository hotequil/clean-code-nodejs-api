import { Express } from "express";
import { serve, setup } from "swagger-ui-express";
import config from "@/main/docs"

export default (app: Express): void => {
    app.use("/docs", serve, setup(config));
};
