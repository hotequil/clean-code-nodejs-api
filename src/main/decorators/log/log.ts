import StatusCode from "status-code-enum";

import { Controller, HttpRequest, HttpResponse } from "../../../presentation/protocols";
import { LogErrorRepository } from "../../../data/protocols/db/log/log-error-repository";

export class LogDecorator implements Controller {
    constructor (private readonly controller: Controller, private readonly logErrorRepository: LogErrorRepository) {}

    async handle (request: HttpRequest): Promise<HttpResponse> {
        const response = await this.controller.handle(request);

        if (response.statusCode === StatusCode.ServerErrorInternal) await this.logErrorRepository.logError(response.body.stack);
        if (response.statusCode !== StatusCode.SuccessOK) response.body = { error: response.body.message };

        return response;
    }
}
