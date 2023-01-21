import { Controller, HttpRequest, HttpResponse } from "@/presentation/protocols";

export const mockController = (response: HttpResponse): Controller => {
    class ControllerStub implements Controller {
        async handle (request: HttpRequest): Promise<HttpResponse> {
            console.log(request);

            return await new Promise(resolve => resolve(response));
        }
    }

    return new ControllerStub()
}
