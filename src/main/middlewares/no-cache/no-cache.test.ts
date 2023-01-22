import request from "supertest";
import app from "../../config/app";
import { noCache } from "./no-cache";

describe("NoCacheMiddleware", () => {
    const route = "/no-cache";

    it(`Should remove cache from route ${route}`, async () => {
        app.get(route, noCache, (request, response) => response.send());

        await request(app).get(route)
                          .expect("cache-control", "no-store, no-cache, must-revalidate, proxy-revalidate")
                          .expect("pragma", "no-cache")
                          .expect("expires", "0")
                          .expect("surrogate-control", "no-store")
    });
});
