import StatusCode from "status-code-enum";

import { Controller, HttpRequest, HttpResponse } from "../../../presentation/protocols";

export class LogDecorator implements Controller {
    constructor (private readonly controller: Controller) {}

    async handle (request: HttpRequest): Promise<HttpResponse> {
        const response = await this.controller.handle(request);

        if (response.statusCode === StatusCode.ServerErrorInternal) console.error(response);

        return response;
    }
}
