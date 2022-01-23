import { AccountModel } from "../../../../domain/models/account";

export const map = (mongoDBAccount: any): AccountModel => {
    const { _id, ...accountWithoutId } = mongoDBAccount;

    return { id: _id, ...accountWithoutId };
}
