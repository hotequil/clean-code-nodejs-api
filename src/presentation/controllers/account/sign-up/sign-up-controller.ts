import { badRequest, forbidden, serverError, success } from "../../../helpers/http-helper";
import { HttpResponse, Controller, AddAccount, Authentication } from "./sign-up-controller-protocols";
import { Validation } from "@/presentation/protocols";
import { EmailInUseError } from "../../../errors/email-in-use/email-in-use-error";

export class SignUpController implements Controller {
    constructor (
        private readonly addAccount: AddAccount,
        private readonly validation: Validation,
        private readonly authentication: Authentication
    ) {}

    async handle (request: SignUpController.Request): Promise<HttpResponse> {
        try {
            const error: Error | null = this.validation.validate(request);

            if (error instanceof Error) return badRequest(error);

            const { name, email, password } = request;
            const account = await this.addAccount.add({ name, email, password })

            if (!account) return forbidden(new EmailInUseError())

            const token = await this.authentication.auth({ email, password });

            return success({ token });
        } catch (error) {
            return serverError(error as Error);
        }
    }
}

export namespace SignUpController{
    export type Request = {
        name: string
        email: string
        password: string
        passwordConfirmation: string
    }
}
