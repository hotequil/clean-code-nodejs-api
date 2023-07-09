import { type AddAccountRepository } from "@/data/protocols/db/account/add-account-repository";
import { type AddAccount } from "@/domain/use-cases/account/add-account";
import { MongodbHelper } from "../helpers";
import { type LoadAccountByEmailRepository } from "@/data/protocols/db/account/load-account-by-email-repository";
import { type UpdateAccessTokenRepository } from "@/data/protocols/db/account/update-access-token-repository";
import { type LoadAccountByTokenRepository } from "@/data/protocols/db/account/load-account-by-token-repository";
import { AccountType } from "@/utils/enums";
import { type CheckAccountByEmailRepository } from "@/data/protocols/db/account/check-account-by-email-repository";

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository, LoadAccountByTokenRepository, CheckAccountByEmailRepository {
    async add (account: AddAccount.Params): Promise<AddAccount.Result> {
        const collection = await MongodbHelper.collection("accounts");
        const { insertedId } = await collection.insertOne(account);
        const response = await collection.findOne({ _id: insertedId });

        return !!MongodbHelper.map(response);
    }

    async loadByEmail (email: string): Promise<LoadAccountByEmailRepository.Result> {
        const collection = await MongodbHelper.collection("accounts");
        const account = await collection.findOne(
            { email },
            {
                projection: {
                    _id: 1,
                    name: 1,
                    password: 1
                }
            }
        );

        if (account) return await MongodbHelper.map(account);

        return null;
    }

    async checkByEmail (email: string): Promise<CheckAccountByEmailRepository.Result> {
        const collection = await MongodbHelper.collection("accounts");
        const result = await collection.findOne({ email }, { projection: { _id: 1 } });

        return !!result;
    }

    async updateAccessToken (id: any, token: string): Promise<void> {
        const collection = await MongodbHelper.collection("accounts");

        await collection.updateOne({ _id: id }, { $set: { accessToken: token } });
    }

    async loadByToken (accessToken: string, role?: AccountType): Promise<LoadAccountByTokenRepository.Result> {
        const collection = await MongodbHelper.collection("accounts")

        const account = await collection.findOne(
            {
                accessToken,
                $or: [
                    { role },
                    { role: AccountType.ADMIN }
                ]
            },
            {
                projection: { _id: 1 }
            }
        )

        if(account) {
            const { id } = MongodbHelper.map(account)

            return { id }
        }

        return null
    }
}
