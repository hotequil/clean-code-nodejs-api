import { StatusCode } from "status-code-enum";
import { type BaseError, type MissingParamsError, ServerError, UnauthorizedError } from "../errors";
import { type HttpResponse } from "../protocols";

export const badRequest = (error: MissingParamsError): HttpResponse => {
    return {
        statusCode: StatusCode.ClientErrorBadRequest,
        body: error
    };
};

export const serverError = (error: Error): HttpResponse => ({
    statusCode: StatusCode.ServerErrorInternal,
    body: new ServerError(error.stack)
});

export const unauthorized = (): HttpResponse => (
    {
        statusCode: StatusCode.ClientErrorUnauthorized,
        body: new UnauthorizedError()
    }
);

export const success = (body: any): HttpResponse => ({
    statusCode: StatusCode.SuccessOK, body
});

export const noContent = (): HttpResponse => ({ body: null, statusCode: StatusCode.SuccessNoContent })

export const forbidden = (error: BaseError): HttpResponse => ({
    statusCode: StatusCode.ClientErrorForbidden,
    body: error
});
