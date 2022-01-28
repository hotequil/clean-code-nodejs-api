import StatusCode from "status-code-enum";

import { Controller, HttpRequest, HttpResponse } from "../../../presentation/protocols";
import { LogDecorator } from "./log";

const RESPONSE_MOCK = {
    statusCode: StatusCode.SuccessOK,
    body: null
};

class ControllerStub implements Controller {
    async handle (request: HttpRequest): Promise<HttpResponse> {
        console.log(request);

        const response: HttpResponse = RESPONSE_MOCK;

        return await new Promise(resolve => resolve(response));
    }
}

describe("LogDecorator", () => {
    let logDecorator: LogDecorator;
    let controllerStub: ControllerStub;

    beforeEach(() => {
        controllerStub = new ControllerStub();
        logDecorator = new LogDecorator(controllerStub);
    });

    it("Should call handle and send data when was called", async () => {
        const controllerStubHandleSpy = jest.spyOn(controllerStub, "handle");

        const request: HttpRequest = {
            body: {
                name: "name",
                email: "email@email.email"
            }
        }

        await logDecorator.handle(request);

        expect(controllerStubHandleSpy).toHaveBeenCalledWith(request);
    });

    it("Should return the same value in ControllerStub and LogDecorator when was called", async () => {
        const request: HttpRequest = {
            body: {
                name: "name"
            }
        };

        const httpResponse = await logDecorator.handle(request);

        expect(httpResponse).toBe(RESPONSE_MOCK);
    });
});
