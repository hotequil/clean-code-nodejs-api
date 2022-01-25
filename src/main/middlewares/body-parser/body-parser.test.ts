import request from "supertest";

import app from "../../config/app";

describe("BodyParserMiddleware", () => {
    const route = "/test";

    it(`Should parser a request to JSON at route ${route}`, async () => {
        const body = { key: "value" };

        app.post(route, (request, response) => response.send(request.body));

        await request(app).post(route).send(body).expect(body);
    });
});
