import { SignUpController } from "./sign-up";

let controller: SignUpController;

describe("SignUpController", () => {
    beforeEach(() => controller = new SignUpController());

    it("Should return code 400 when name is not provided", () => {
        const request = {
            body: {
                email: "email@email.email",
                password: "passwordAndConfirmation",
                passwordConfirmation: "passwordAndConfirmation"
            }
        };

        const { body, statusCode } = controller.handle(request);

        expect(statusCode).toBe(400);
        expect(body).toEqual(new Error("Missing param: name"));
    });

    it("Should return code 400 when email is not provided", () => {
        const request = {
            body: {
                name: "name@name.name",
                password: "passwordAndConfirmation",
                passwordConfirmation: "passwordAndConfirmation"
            }
        };

        const { statusCode, body } = controller.handle(request);

        expect(statusCode).toBe(400);
        expect(body).toEqual(new Error("Missing param: email"));
    });
});
