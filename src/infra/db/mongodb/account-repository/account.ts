import { AddAccountRepository } from "../../../../data/protocols/add-account-repository";
import { AddAccountModel } from "../../../../domain/use-cases/add-account";
import { AccountModel } from "../../../../domain/models/account";
import { MongodbHelper } from "../helpers/mongodb-helper";

export class Account implements AddAccountRepository {
    async add (account: AddAccountModel): Promise<AccountModel> {
        const collection = await MongodbHelper.collection("accounts");
        const { insertedId } = await collection.insertOne(account);
        const response = await collection.findOne({ _id: insertedId });

        return MongodbHelper.map<AccountModel>(response);
    }
}
