import { type Controller } from "@/presentation/protocols";
import { LogDecorator } from "@/main/decorators/log/log-controller-decorator";
import { LogMongoRepository } from "@/infra/db/mongodb/log/log-mongo-repository";

export const makeLogDecorator = (controller: Controller): LogDecorator => new LogDecorator(controller, new LogMongoRepository())
