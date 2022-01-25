import request from "supertest";

import app from "../../config/app";

describe("ContentType", () => {
    let route = "/test";

    it("Should apply JSON as content-type in app", async () => {
        app.get(route, (request, response) => response.send());

        await request(app).get(route).expect("content-type", /json/);
    });

    it("Should return a xml when forced", async () => {
        route = "/test-xml";

        app.get(route, (request, response) => {
            response.type("xml");
            response.send();
        });

        await request(app).get(route).expect("content-type", /xml/);
    });
});
