import { StatusCode } from "status-code-enum";

import { MissingParamsError } from "../errors/missing-params/missing-params-error";
import { HttpResponse } from "../protocols/http";
import { ServerError } from "../errors/server/server-error";

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
