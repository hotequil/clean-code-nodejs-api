import { Controller, HttpResponse } from "@/presentation/protocols";

export const mockController = (response: HttpResponse): Controller => {
    class ControllerStub implements Controller {
        async handle (request: any): Promise<HttpResponse> {
            console.log(request);

            return response;
        }
    }

    return new ControllerStub()
}
