import { MissingParamsError } from "./missing-params-error";

describe(MissingParamsError.name, () => {
    it("Should put text \"params\" when it was instancied with two parameters", () => {
        const instance = new MissingParamsError("first error", "second error");

        expect(instance.message.includes("params")).toBeTruthy();
    });
});
