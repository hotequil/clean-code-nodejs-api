import { Request, Response, Router } from "express";
import StatusCode from "status-code-enum";

export default (router: Router): void => {
    router.post("/sign-up", (request: Request, response: Response) => {
        response.status(StatusCode.SuccessOK);
        response.end();
    });
};
