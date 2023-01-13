import StatusCode from "status-code-enum";
import { Controller, HttpRequest, HttpResponse } from "@/presentation/protocols";
import { LogErrorRepository } from "@/data/protocols/db/log/log-error-repository";

export class LogDecorator implements Controller {
    constructor (private readonly controller: Controller, private readonly logErrorRepository: LogErrorRepository) {}

    async handle (request: HttpRequest): Promise<HttpResponse> {
        const response = await this.controller.handle(request);
        const { statusCode } = response

        if (statusCode === StatusCode.ServerErrorInternal) await this.logErrorRepository.logError(response.body.stack);
        if (statusCode < StatusCode.SuccessOK || statusCode > StatusCode.SuccessIMUsed) response.body = { error: response.body.message };

        return response;
    }
}
