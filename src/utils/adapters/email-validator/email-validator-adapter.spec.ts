import { EmailValidatorAdapter } from "./email-validator-adapter";

let adapter: EmailValidatorAdapter;

describe("EmailValidatorAdapter", () => {
    beforeEach(() => adapter = new EmailValidatorAdapter());

    it("Should return false if email is invalid when was called", () => {
        const isValid = adapter.isValid("");

        expect(isValid).toBe(false);
    });
});
