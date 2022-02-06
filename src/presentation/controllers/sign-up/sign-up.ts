import { MissingParamsError, InvalidParamsError } from "../../errors";
import { badRequest, serverError, success } from "../../helpers/http-helper";
import { EmailValidator, HttpRequest, HttpResponse, Controller, AddAccount } from "./sign-up-protocols";
import { Validation } from "../../validators/validation";

export class SignUpController implements Controller {
    constructor (
        private readonly emailValidator: EmailValidator,
        private readonly addAccount: AddAccount,
        private readonly validation: Validation
    ) {}

    async handle ({ body }: HttpRequest): Promise<HttpResponse> {
        try {
            this.validation.validate(body);

            const requiredFields = ["name", "email", "password", "passwordConfirmation"];

            for (const field of requiredFields) {
                if (!body[field]) return badRequest(new MissingParamsError(field));
            }

            const { name, email, password, passwordConfirmation } = body;

            if (password !== passwordConfirmation)
                return badRequest(new InvalidParamsError("passwordConfirmation"));

            if (!this.emailValidator.isValid(email))
                return badRequest(new InvalidParamsError("email"));

            return success(await this.addAccount.add({ name, email, password }));
        } catch (error) {
            return serverError(error as Error);
        }
    }
}
