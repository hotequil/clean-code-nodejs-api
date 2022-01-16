import validator from "validator";

import { EmailValidatorAdapter } from "./email-validator-adapter";

jest.mock("validator", () => {
    return {
        isEmail: () => true
    }
})

let adapter: EmailValidatorAdapter;

describe("EmailValidatorAdapter", () => {
    beforeEach(() => adapter = new EmailValidatorAdapter());

    it("Should return false if email is invalid when isValid was called", () => {
        jest.spyOn(validator, "isEmail").mockReturnValueOnce(false);
        const isValid = adapter.isValid("invalid@invalid.invalid");

        expect(isValid).toBe(false);
    });

    it("Should return true if email is valid when isValid was called", () => {
        const isValid = adapter.isValid("valid@valid.valid");

        expect(isValid).toBe(true);
    })
});
