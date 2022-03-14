import { AddAccountRepository } from "../../../../data/protocols/db/add-account-repository";
import { AddAccountModel } from "../../../../domain/use-cases/add-account";
import { AccountModel } from "../../../../domain/models/account";
import { MongodbHelper } from "../helpers/mongodb-helper";
import { LoadAccountByEmailRepository } from "../../../../data/protocols/db/load-account-by-email-repository";
import { UpdateAccessTokenRepository } from "../../../../data/protocols/db/update-access-token-repository";

export class Account implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository {
    async add (account: AddAccountModel): Promise<AccountModel> {
        const collection = await MongodbHelper.collection("accounts");
        const { insertedId } = await collection.insertOne(account);
        const response = await collection.findOne({ _id: insertedId });

        return MongodbHelper.map<AccountModel>(response);
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
}
