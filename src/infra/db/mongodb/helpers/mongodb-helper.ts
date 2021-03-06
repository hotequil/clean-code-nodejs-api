import { MongoClient, Collection, Db } from "mongodb";

import env from "../../../../main/config/env";

type Client = MongoClient|null;

let client: Client = null;

export class MongodbHelper {
    static async connect (): Promise<void> {
        if (client) return;

        // @ts-ignore
        client = await MongoClient.connect(env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    }

    static async disconnect (): Promise<void> {
        if (!client) return;

        await client.close();

        client = null;
    }

    static async collection (name: string): Promise<Collection> {
        const db = await MongodbHelper.db();

        return db.collection(name);
    }

    static async db (): Promise<Db> {
        if (!client) await MongodbHelper.connect();

        return (client as MongoClient).db();
    }

    static map<T = any> (item: any): T {
        const { _id, ...newItem } = item;

        return { id: _id, ...newItem };
    }
}
