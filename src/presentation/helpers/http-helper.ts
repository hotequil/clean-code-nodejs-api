import { StatusCode } from "status-code-enum";

import { MissingParamsError, ServerError, UnauthorizedError } from "../errors";
import { HttpResponse } from "../protocols";

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
