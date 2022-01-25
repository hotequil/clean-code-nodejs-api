import { Express, Router } from "express";
import fastGlob from "fast-glob";

export default (app: Express): void => {
    const router = Router();

    app.use("/api", router);

    const files = fastGlob.sync("**/src/main/routes/**-routes.ts");

    files.map(async file => {
        const imported = await import(`../../../${file}`);
        const route = imported.default;

        route(router);
    });
};
