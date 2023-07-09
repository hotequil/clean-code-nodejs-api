import { type LogErrorRepository } from "@/data/protocols/db/log/log-error-repository";

export const mockLogErrorRepository = (): LogErrorRepository => {
    class LogErrorRepositoryStub implements LogErrorRepository {
        async logError (stack: string): Promise<void> {
            console.log(stack);

            await Promise.resolve();
        }
    }

    return new LogErrorRepositoryStub()
}
