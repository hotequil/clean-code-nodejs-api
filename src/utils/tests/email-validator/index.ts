import { type EmailValidator } from "@/validation/protocols/email-validator";

export const mockEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid (email: string): boolean {
            console.log(email);

            return true;
        }
    }

    return new EmailValidatorStub()
}
