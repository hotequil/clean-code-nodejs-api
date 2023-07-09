import StatusCode from "status-code-enum";
import { type Controller } from "@/presentation/protocols";
import { LogDecorator } from "./log-controller-decorator";
import { serverError } from "@/presentation/helpers/http-helper";
import { type LogErrorRepository } from "@/data/protocols/db/log/log-error-repository";
import { mockController, mockLogErrorRepository } from "@/utils/tests";

const RESPONSE_MOCK = {
    statusCode: StatusCode.SuccessOK,
    body: null
};

const mockRequest = (): LogDecorator.Request => ({});

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
        const request = mockRequest();

        await logDecorator.handle(request);

        expect(controllerStubHandleSpy).toHaveBeenCalledWith(request);
    });

    it("Should return the same value in ControllerStub and LogDecorator when was called", async () => {
        const request = mockRequest();
        const httpResponse = await logDecorator.handle(request);

        expect(httpResponse).toBe(RESPONSE_MOCK);
    });

    it(`Should get a stack trace when throw an error with code ${StatusCode.ServerErrorInternal}`, async () => {
        const logSpy = jest.spyOn(logErrorRepositoryStub, "logError");
        const request = mockRequest();
        const error = new Error();
        const stack = "Error from server";

        error.stack = stack;

        const errorFromServer = serverError(error);

        jest.spyOn(controllerStub, "handle").mockReturnValueOnce(Promise.resolve(errorFromServer));

        await logDecorator.handle(request);

        expect(logSpy).toHaveBeenCalledWith(stack);
    });
});
