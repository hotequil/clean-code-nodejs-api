import { type NextFunction, type Response, type Request } from "express";

export const contentType = (request: Request, response: Response, next: NextFunction): void => {
    response.type("json");
    next();
};
