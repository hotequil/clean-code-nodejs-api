import validator from "validator";

import { EmailValidatorAdapter } from "./email-validator-adapter";

jest.mock("validator", () => {
    return {
        isEmail: () => true
    }
});

let adapter: EmailValidatorAdapter;

describe("EmailValidatorAdapter", () => {
    beforeEach(() => adapter = new EmailValidatorAdapter());

    it("Should return false if isValid return false when was called", () => {
        jest.spyOn(validator, "isEmail").mockReturnValueOnce(false);

        const isValid = adapter.isValid("invalid@invalid.invalid");

        expect(isValid).toBe(false);
    });

    it("Should return true if isValid return true when was called", () => {
        const isValid = adapter.isValid("valid@valid.valid");

        expect(isValid).toBe(true);
    });

    it("Should call isValid with a correct email when was called", () => {
        const email = "email@email.email";
        const isEmailSpy = jest.spyOn(validator, "isEmail");

        adapter.isValid(email);

        expect(isEmailSpy).toHaveBeenCalledWith(email);
    });
});
