import { Controller } from "../../../../presentation/protocols";
import { LogDecorator } from "../../../decorators/log/log-controller-decorator";
import { LogMongoRepository } from "../../../../infra/db/mongodb/log-repository/log-mongo-repository";

export const makeLogDecorator = (controller: Controller): LogDecorator => new LogDecorator(controller, new LogMongoRepository())
