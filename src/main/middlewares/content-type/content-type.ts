import { NextFunction, Response, Request } from "express";

export const contentType = (request: Request, response: Response, next: NextFunction): void => {
    response.type("json");
    next();
};
