import StatusCode from "status-code-enum";

import { Controller, HttpRequest, HttpResponse } from "../../../presentation/protocols";
import { LogDecorator } from "./log";

class ControllerStub implements Controller {
    async handle (request: HttpRequest): Promise<HttpResponse> {
        const response: HttpResponse = {
            statusCode: StatusCode.SuccessOK,
            body: request.body
        };

        return await new Promise(resolve => resolve(response));
    }
}

describe("LogDecorator", () => {
    it("Should call handle and send data when was called", async () => {
        const controllerStub = new ControllerStub();
        const controllerStubHandleSpy = jest.spyOn(controllerStub, "handle");
        const logDecorator = new LogDecorator(controllerStub);

        const request: HttpRequest = {
            body: {
                name: "name",
                email: "email@email.email"
            }
        }

        await logDecorator.handle(request);

        expect(controllerStubHandleSpy).toHaveBeenCalledWith(request);
    });
});
