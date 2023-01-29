// @ts-ignore
import { default as config } from "./jest.config";
import { Config } from "@jest/types";
import { copy } from "./src/presentation/helpers/manipulator-helper";

const integrationConfig = copy<Config.InitialOptions>(config);

integrationConfig.testMatch = ["**/?(*.)+(test.ts)"];

export default integrationConfig;
