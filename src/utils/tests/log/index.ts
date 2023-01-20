import { LogErrorRepository } from "@/data/protocols/db/log/log-error-repository";

export const mockLogErrorRepository = (): LogErrorRepository => {
    class LogErrorRepositoryStub implements LogErrorRepository {
        async logError (stack: string): Promise<void> {
            console.log(stack);

            return await new Promise(resolve => resolve());
        }
    }

    return new LogErrorRepositoryStub()
}
