import request from "supertest";
import StatusCode from "status-code-enum";
import { type Collection } from "mongodb";
import { hash } from "bcrypt";
import app from "../config/app";
import { MongodbHelper } from "@/infra/db/mongodb/helpers";
import { mockAddAccountParams } from "@/utils/tests";

const PASSWORD = "passwordAndConfirmation"
const SALT = 12;
const ACCOUNT = mockAddAccountParams(PASSWORD)

describe("AccountRoutes", () => {
    let collection: Collection;

    beforeAll(async () => {
        await MongodbHelper.connect()
    });

    afterAll(async () => {
        await MongodbHelper.disconnect()
    });

    beforeEach(async () => {
        collection = await MongodbHelper.collection("accounts");

        await collection.deleteMany({});
    });

    it(`Should return status code ${StatusCode.SuccessOK} when send a POST to route /api/sign-up with data`, async () => {
        await request(app).post("/api/sign-up")
                          .send({ ...ACCOUNT, passwordConfirmation: PASSWORD })
                          .expect(StatusCode.SuccessOK);
    });

    it(`Should return status code ${StatusCode.SuccessOK} when /api/login (POST) was succeed`, async () => {
        await collection.insertOne({ ...ACCOUNT, password: await hash(PASSWORD, SALT) });

        const { email, password } = ACCOUNT;

        await request(app).post("/api/login").send({ email, password }).expect(StatusCode.SuccessOK);
    });

    it(`Should return status code ${StatusCode.ClientErrorUnauthorized} when /api/login (POST) was failed`, async () => {
        const { email, password } = ACCOUNT;

        await request(app).post("/api/login").send({ email, password }).expect(StatusCode.ClientErrorUnauthorized);
    });
});
