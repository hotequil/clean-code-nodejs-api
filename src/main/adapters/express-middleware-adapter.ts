import { NextFunction, Request, Response } from "express";
import StatusCode from "status-code-enum";
import { HttpRequest } from "../../presentation/protocols";
import { Middleware } from "../../presentation/protocols/middleware";

export const adaptMiddleware = (middleware: Middleware) => {
    return async (request: Request, response: Response, next: NextFunction) => {
        const httpRequest: HttpRequest = { headers: request.headers };
        const { statusCode, body } = await middleware.handle(httpRequest);

        if(statusCode === StatusCode.SuccessOK){
            Object.assign(request, body)
            next()
        } else response.status(statusCode).json({ error: body.message })
    }
};
