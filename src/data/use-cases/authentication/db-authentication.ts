import { Authentication, AuthenticationModel } from "../../../domain/use-cases/authentication";
import { LoadAccountByEmailRepository } from "../../protocols/db/load-account-by-email-repository";

export class DbAuthentication implements Authentication {
    constructor (private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository) {}

    async auth (model: AuthenticationModel): Promise<string> {
        await this.loadAccountByEmailRepository.load(model.email);

        return "";
    }
}
