import { AccountModel } from "@/domain/models/account";
import { AddAccountParams } from "@/domain/use-cases/account/add-account";

export const mockAccountModel = (): AccountModel => ({
    id: "id",
    name: "name",
    email: "email@test.com",
    password: "password",
    accessToken: "accessToken",
})

export const mockAddAccountParams = (): AddAccountParams => ({
    name: "name",
    email: "email@email.email",
    password: "password",
})
