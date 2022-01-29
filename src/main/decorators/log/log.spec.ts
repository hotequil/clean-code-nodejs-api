import StatusCode from "status-code-enum";

import { Controller, HttpRequest, HttpResponse } from "../../../presentation/protocols";
import { LogDecorator } from "./log";
import { serverError } from "../../../presentation/helpers/http-helper";
import { LogErrorRepository } from "../../../data/protocols/log-error-repository";

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

class LogErrorRepositoryStub implements LogErrorRepository {
    async log (stack: string): Promise<void> {
        console.log(stack);

        return await new Promise(resolve => resolve());
    }
}

describe("LogDecorator", () => {
    let logDecorator: LogDecorator;
    let controllerStub: ControllerStub;
    let logErrorRepositoryStub: LogErrorRepository;

    beforeEach(() => {
        controllerStub = new ControllerStub();
        logErrorRepositoryStub = new LogErrorRepositoryStub();
        logDecorator = new LogDecorator(controllerStub, logErrorRepositoryStub);
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

    it(`Should get a stack trace when throw an error with code ${StatusCode.ServerErrorInternal}`, async () => {
        const logSpy = jest.spyOn(logErrorRepositoryStub, "log");
        const httpRequest: HttpRequest = { body: { name: "name" } };
        const error = new Error();
        const stack = "Error from server";

        error.stack = stack;

        const errorFromServer = serverError(error);

        jest.spyOn(controllerStub, "handle")
            .mockImplementationOnce(async () => await new Promise(resolve => resolve(errorFromServer)));

        await logDecorator.handle(httpRequest);

        expect(logSpy).toHaveBeenCalledWith(stack);
    });
});
