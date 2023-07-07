import { NextFunction, Request, Response } from "express";
import StatusCode from "status-code-enum";
import { Middleware } from "@/presentation/protocols/middleware";

export const adaptMiddleware = (middleware: Middleware) => {
    return async (request: Request, response: Response, next: NextFunction) => {
        const { statusCode, body } = await middleware.handle(request.headers);

        if(statusCode === StatusCode.SuccessOK){
            Object.assign(request, body)
            next()
        } else response.status(statusCode).json({ error: body.message })
    }
};
