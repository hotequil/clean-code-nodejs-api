import StatusCode from "status-code-enum";
import { Controller, HttpRequest } from "@/presentation/protocols";
import { LogDecorator } from "./log-controller-decorator";
import { serverError } from "@/presentation/helpers/http-helper";
import { LogErrorRepository } from "@/data/protocols/db/log/log-error-repository";
import { mockController, mockLogErrorRepository } from "@/utils/tests";

const RESPONSE_MOCK = {
    statusCode: StatusCode.SuccessOK,
    body: null
};

const mockHttpRequest = (): HttpRequest => (
    {
        body: {
            name: "name",
            email: "email@email.email"
        }
    }
);

describe("LogDecorator", () => {
    let logDecorator: LogDecorator;
    let controllerStub: Controller;
    let logErrorRepositoryStub: LogErrorRepository;

    beforeEach(() => {
        controllerStub = mockController(RESPONSE_MOCK);
        logErrorRepositoryStub = mockLogErrorRepository();
        logDecorator = new LogDecorator(controllerStub, logErrorRepositoryStub);
    });

    it("Should call handle and send data when was called", async () => {
        const controllerStubHandleSpy = jest.spyOn(controllerStub, "handle");
        const request: HttpRequest = mockHttpRequest();

        await logDecorator.handle(request);

        expect(controllerStubHandleSpy).toHaveBeenCalledWith(request);
    });

    it("Should return the same value in ControllerStub and LogDecorator when was called", async () => {
        const request: HttpRequest = mockHttpRequest();
        const httpResponse = await logDecorator.handle(request);

        expect(httpResponse).toBe(RESPONSE_MOCK);
    });

    it(`Should get a stack trace when throw an error with code ${StatusCode.ServerErrorInternal}`, async () => {
        const logSpy = jest.spyOn(logErrorRepositoryStub, "logError");
        const httpRequest: HttpRequest = mockHttpRequest();
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
