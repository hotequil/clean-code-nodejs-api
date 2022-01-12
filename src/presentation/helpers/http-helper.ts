import { StatusCode } from "status-code-enum";

import { MissingParamsError } from "../errors/missing-params/missing-params-error";
import { HttpResponse } from "../protocols/http";

export const badRequest = (error: MissingParamsError): HttpResponse => {
    return {
        statusCode: StatusCode.ClientErrorBadRequest,
        body: error
    };
};
