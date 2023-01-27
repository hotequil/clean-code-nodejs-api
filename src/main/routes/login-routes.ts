import { Router } from "express";
import { adaptRoute } from "../adapters/express-route-adapter";
import { makeSignUpController } from "../factories/controllers/account/sign-up/sign-up-controller-factory";
import { makeLoginController } from "../factories/controllers/account/login/login-controller-factory";

export default (router: Router): void => {
    router.post("/sign-up", adaptRoute(makeSignUpController()));
    router.post("/login", adaptRoute(makeLoginController()));
};
