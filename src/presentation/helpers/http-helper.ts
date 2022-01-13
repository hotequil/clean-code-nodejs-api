import { StatusCode } from "status-code-enum";

import { MissingParamsError, ServerError } from "../errors";
import { HttpResponse } from "../protocols";

export const badRequest = (error: MissingParamsError): HttpResponse => {
    return {
        statusCode: StatusCode.ClientErrorBadRequest,
        body: error
    };
};

export const serverError = (): HttpResponse => ({
    statusCode: StatusCode.ServerErrorInternal,
    body: new ServerError()
})
