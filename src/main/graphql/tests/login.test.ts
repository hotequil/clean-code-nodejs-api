import { Collection } from "mongodb";
import { MongodbHelper } from "@/infra/db/mongodb/helpers";
import { mockAddAccountParams } from "@/utils/tests";
import { hash } from "bcrypt";
import { Express } from "express";
import request from "supertest";
import { makeApp } from "@/main/graphql/tests/helper";
import StatusCode from "status-code-enum";

const route = "/graphql"
const validPassword = "1234"
const account = mockAddAccountParams(validPassword)

describe("Login GraphQL", () => {
    let collection: Collection;
    let app: Express

    beforeAll(async () => {
        await MongodbHelper.connect()

        app = await makeApp()
    });

    afterAll(async () => {
        await MongodbHelper.disconnect()
    });

    beforeEach(async () => {
        collection = await MongodbHelper.collection("accounts");

        await collection.deleteMany({});
    });

    describe("Login Query", () => {
        const query = `
            query login($email: String!, $password: String!){
                login(email: $email, password: $password){
                    accessToken
                    name
                }
            }
        `

        it("Should return an account on valid credentials", async () => {
            await collection.insertOne({ ...account, password: await hash(validPassword, 12) })

            const { email, password } = account
            const { body } = await request(app).post(route).send({ query, variables: { email, password } });

            expect(body.data.login.accessToken).toBeTruthy()
            expect(body.data.login.name).toBe(account.name)
        })

        it(`Should return unauthorized (${StatusCode.ClientErrorUnauthorized}) on invalid credentials`, async () => {
            const { email, password } = account
            const { body, statusCode } = await request(app).post(route).send({ query, variables: { email, password } });

            expect(body.data).toBe(null)
            expect(statusCode).toBe(StatusCode.ClientErrorUnauthorized)
        })
    });

    describe("SignUp Mutation", () => {
        const mutation = `
            mutation signUp($name: String!, $email: String!, $password: String!, $passwordConfirmation: String!){
                signUp(name: $name, email: $email, password: $password, passwordConfirmation: $passwordConfirmation){
                    accessToken
                    name
                }
            }
        `

        it(`Should create an account on success (${StatusCode.SuccessOK}) request`, async () => {
            const { body, statusCode } = await request(app).post(route).send({ query: mutation, variables: { ...account, passwordConfirmation: account.password } });

            expect(body.data.signUp.accessToken).toBeTruthy()
            expect(body.data.signUp.name).toBe(account.name)
            expect(statusCode).toBe(StatusCode.SuccessOK)
        })
    })
})
