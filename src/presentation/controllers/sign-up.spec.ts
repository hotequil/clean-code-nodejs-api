import { SignUpController } from "./sign-up";

describe("SignUpController", () => {
    it("Should return code 400 when name is not provided", () => {
        const request = {
            body: {
                email: "email@email.email",
                password: "passwordAndConfirmation",
                passwordConfirmation: "passwordAndConfirmation"
            }
        };

        const controller = new SignUpController();
        const response = controller.handle(request);

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(new Error("Missing param: name"));
    });
});
