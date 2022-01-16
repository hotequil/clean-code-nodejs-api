import { Config } from "@jest/types";

import { default as config } from "./jest.config";
import { copy } from "./src/presentation/helpers/manipulator-helper";

const unitConfig = copy<Config.InitialOptions>(config);

unitConfig.testMatch = ["**/?(*.)+(spec.ts)"];

export default unitConfig;
