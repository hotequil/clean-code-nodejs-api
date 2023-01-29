import { LogErrorRepository } from "@/data/protocols/db/log/log-error-repository";
import { MongodbHelper } from "../helpers";

export class LogMongoRepository implements LogErrorRepository {
    async logError (stack: string): Promise<void> {
        const errors = await MongodbHelper.collection("errors");

        await errors.insertOne({ stack, date: new Date() });
    }
}
