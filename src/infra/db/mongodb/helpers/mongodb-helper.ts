import { MongoClient, Collection } from "mongodb";

let client!: MongoClient;

export class MongodbHelper {
    static client (): MongoClient {
        return client;
    };

    static async connect (): Promise<void> {
        if (client) return;

        // @ts-ignore
        client = await MongoClient.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    }

    static async disconnect (): Promise<void> {
        if (!client) return;

        await client.close();
    }

    static collection (name: string): Collection {
        return client.db().collection(name);
    }
}
