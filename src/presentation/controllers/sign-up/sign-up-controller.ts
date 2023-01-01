import { badRequest, serverError, success } from "../../helpers/http-helper";
import { HttpRequest, HttpResponse, Controller, AddAccount, Authentication } from "./sign-up-controller-protocols";
import { Validation } from "../../protocols/validation";

export class SignUpController implements Controller {
    constructor (
        private readonly addAccount: AddAccount,
        private readonly validation: Validation,
        private readonly authentication: Authentication
    ) {}

    async handle ({ body }: HttpRequest): Promise<HttpResponse> {
        try {
            const error: Error | null = this.validation.validate(body);

            if (error instanceof Error) return badRequest(error);

            const { name, email, password } = body;
            const account = await this.addAccount.add({ name, email, password })
            const token = await this.authentication.auth({ email: account.email, password: account.password });

            return success({ token });
        } catch (error) {
            return serverError(error as Error);
        }
    }
}
