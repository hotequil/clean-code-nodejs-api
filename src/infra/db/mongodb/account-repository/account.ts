import { AddAccountRepository } from "../../../../data/protocols/add-account-repository";
import { AddAccountModel } from "../../../../domain/use-cases/add-account";
import { AccountModel } from "../../../../domain/models/account";
import { MongodbHelper } from "../helpers/mongodb-helper";

export class Account implements AddAccountRepository {
    async add (account: AddAccountModel): Promise<AccountModel> {
        const collection = MongodbHelper.collection("accounts");

        const { insertedId } = await collection.insertOne(account);

        // @ts-ignore
        delete account._id;

        return { ...account, id: insertedId.toJSON() };
    }
}
