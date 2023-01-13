import request from "supertest";
import app from "../../config/app";

describe("CorsMiddleware", () => {
    const route = "/test";

    it("Should enable CORS in application", async () => {
        app.get(route, (request, response) => response.send());

        await request(app).get(route)
                          .expect("access-control-allow-origin", "*")
                          .expect("access-control-allow-methods", "*")
                          .expect("access-control-allow-headers", "*");
    });
});
