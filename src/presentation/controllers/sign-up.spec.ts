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

        const response = controller.handle(request);

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(new Error("Missing param: name"));
    });

    it("Should return code 400 when email is not provided", () => {
        const request = {
            body: {
                name: "name@name.name",
                password: "passwordAndConfirmation",
                passwordConfirmation: "passwordAndConfirmation"
            }
        };

        const response = controller.handle(request);

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(new Error("Missing param: email"));
    });
});
