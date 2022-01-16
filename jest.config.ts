import { Config } from "@jest/types";

const config: Config.InitialOptions = {
    roots: ["<rootDir>/src"],
    collectCoverageFrom: ["<rootDir>/src/presentation/controllers/sign-up/sign-up.ts"],
    collectCoverage: true,
    coverageDirectory: "coverage",
    testEnvironment: "node",
    transform: {
        ".+\\.ts$": "ts-jest"
    }
};

export default config;
