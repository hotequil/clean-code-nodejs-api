import express from "express";
import middlewares from "./middlewares";
import routes from "./routes";
import swagger from "@/main/config/swagger";
import apolloServer from "@/main/config/apollo-server";
import staticFiles from "@/main/config/static-files";

const app = express();

staticFiles(app)
swagger(app)
void apolloServer(app)
middlewares(app);
routes(app);

export default app;
