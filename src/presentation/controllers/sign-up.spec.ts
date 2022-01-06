import { SignUpController } from "./sign-up";

describe("SignUpController", () => {
    it("Should return code 400 when name is not provided", () => {
        const request = {
            body: {
                name: "name",
                email: "email@email.email",
                password: "passwordAndConfirmation",
                passwordConfirmation: "passwordAndConfirmation"
            }
        };

        const controller = new SignUpController();
        const response = controller.handle(request);

        expect(response.statusCode).toBe(400);
    });
});
