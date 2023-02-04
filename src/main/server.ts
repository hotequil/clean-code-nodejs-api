import "module-alias/register"
import env from "./config/env";
import { MongodbHelper } from "@/infra/db/mongodb/helpers";

void MongodbHelper.connect()
                  .then(async () => {
                      const appImported = await import("./config/app");
                      const app = appImported.default;

                      app.listen(env.PORT, () => console.log(`Server running at port ${env.PORT}`));
                  })
                  .catch(console.error);
