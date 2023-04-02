import { AddAccountRepository } from "@/data/protocols/db/account/add-account-repository";
import { AddAccount } from "@/domain/use-cases/account/add-account";
import { AccountModel } from "@/domain/models/account";
import { MongodbHelper } from "../helpers";
import { LoadAccountByEmailRepository } from "@/data/protocols/db/account/load-account-by-email-repository";
import { UpdateAccessTokenRepository } from "@/data/protocols/db/account/update-access-token-repository";
import { LoadAccountByTokenRepository } from "@/data/protocols/db/account/load-account-by-token-repository";
import { AccountType } from "@/utils/enums";

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository, LoadAccountByTokenRepository {
    async add (account: AddAccount.Params): Promise<AddAccount.Result> {
        const collection = await MongodbHelper.collection("accounts");
        const { insertedId } = await collection.insertOne(account);
        const response = await collection.findOne({ _id: insertedId });

        return !!MongodbHelper.map<AccountModel>(response);
    }

    async loadByEmail (email: string): Promise<AccountModel|null> {
        const collection = await MongodbHelper.collection("accounts");
        const account = await collection.findOne<AccountModel>({ email });

        if (account) return MongodbHelper.map<AccountModel>(account);

        return null;
    }

    async updateAccessToken (id: any, token: string): Promise<void> {
        const collection = await MongodbHelper.collection("accounts");

        await collection.updateOne({ _id: id }, { $set: { accessToken: token } });
    }

    async loadByToken (accessToken: string, role?: AccountType): Promise<AccountModel | null> {
        const collection = await MongodbHelper.collection("accounts")

        const account = await collection.findOne<AccountModel>({
            accessToken,
            $or: [
                { role },
                { role: AccountType.ADMIN },
            ]
        })

        return account ? MongodbHelper.map<AccountModel>(account) : null
    }
}
