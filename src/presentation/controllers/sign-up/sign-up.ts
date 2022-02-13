import { badRequest, serverError, success } from "../../helpers/http-helper";
import { HttpRequest, HttpResponse, Controller, AddAccount } from "./sign-up-protocols";
import { Validation } from "../../validators/validation";

export class SignUpController implements Controller {
    constructor (
        private readonly addAccount: AddAccount,
        private readonly validation: Validation
    ) {}

    async handle ({ body }: HttpRequest): Promise<HttpResponse> {
        try {
            const error = this.validation.validate(body);

            if (error instanceof Error) return badRequest(error);

            const { name, email, password } = body;

            return success(await this.addAccount.add({ name, email, password }));
        } catch (error) {
            return serverError(error as Error);
        }
    }
}
