import { Request, Response } from "express";
import StatusCode from "status-code-enum";

import { Controller, HttpRequest } from "@/presentation/protocols";

export const adaptRoute = (controller: Controller) => {
    return async (request: Request, response: Response) => {
        const httpRequest: HttpRequest = { body: request.body };
        const { statusCode, body } = await controller.handle(httpRequest);

        response.status(statusCode);

        if (statusCode === StatusCode.ServerErrorInternal) response.json({ error: body.message });
        else response.json(body);
    }
};
