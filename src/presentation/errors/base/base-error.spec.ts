import { BaseError } from "./base-error";

describe(BaseError.name, () => {
    it("Should put text \"params\" when it was instancied with two parameters", () => {
        const instance = new BaseError("BaseError", ["first error", "second error"]);

        expect(instance.message.includes("params")).toBeTruthy();
    });
});
