import { Config } from "@jest/types";

const config: Config.InitialOptions = {
    roots: ["<rootDir>/src"],
    collectCoverage: true,
    coverageDirectory: "coverage",
    testEnvironment: "node",
    transform: {
        ".+\\.ts$": "ts-jest"
    },
    collectCoverageFrom: [
        "<rootDir>/src/presentation/controllers/sign-up/sign-up.ts",
        "<rootDir>/src/utils/adapters/email-validator/email-validator-adapter.ts"
    ]
};

export default config;
