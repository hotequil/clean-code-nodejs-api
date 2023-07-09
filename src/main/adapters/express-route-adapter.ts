import { type Request, type Response } from "express";
import StatusCode from "status-code-enum";
import { type Controller } from "@/presentation/protocols";

export const adaptRoute = (controller: Controller) => {
    return async (request: Request, response: Response) => {
        const { statusCode, body } = await controller.handle({ ...request.body, ...request.params, accountId: request.accountId });

        response.status(statusCode);

        if (statusCode === StatusCode.ServerErrorInternal) response.json({ error: body.message });
        else response.json(body);
    }
};
