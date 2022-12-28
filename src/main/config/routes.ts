import { Express, Router } from "express";
import { readdirSync } from "fs";
import path from "node:path";

export default (app: Express): void => {
    const router = Router();

    app.use("/api", router);

    const files = readdirSync(path.join(__dirname, "../routes"));

    files.filter(file => !file.includes(".test."))
         .map(async file => {
             const imported = await import(`../routes/${file}`);
             const route = imported.default;

             route(router);
         });
};
