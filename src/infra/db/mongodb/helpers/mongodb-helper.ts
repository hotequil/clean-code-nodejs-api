import { MongoClient, Collection } from "mongodb";

import env from "../../../../main/config/env";

let client!: MongoClient;

export class MongodbHelper {
    static client (): MongoClient {
        return client;
    };

    static async connect (): Promise<void> {
        if (client) return;

        // @ts-ignore
        client = await MongoClient.connect(env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    }

    static async disconnect (): Promise<void> {
        if (!client) return;

        await client.close();
    }

    static collection (name: string): Collection {
        return client.db().collection(name);
    }

    static map<T = any> (item: any): T {
        const { _id, ...newItem } = item;

        return { id: _id, ...newItem };
    }
}
