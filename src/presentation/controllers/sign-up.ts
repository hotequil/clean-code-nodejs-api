export class SignUpController {
    handle (request: any): any {
        const error = { statusCode: 400 };

        switch (true) {
            case !request.body.name:
                Object.assign(error, { body: new Error("Missing param: name") });
                break;
            case !request.body.email:
                Object.assign(error, { body: new Error("Missing param: email") });
                break;
        }

        return error;
    }
}
