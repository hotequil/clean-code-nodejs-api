import { Config } from "@jest/types";

const config: Config.InitialOptions = {
    roots: ["<rootDir>/src"],
    collectCoverage: true,
    coverageDirectory: "coverage",
    testEnvironment: "node",
    preset: "@shelf/jest-mongodb",
    transform: {
        ".+\\.ts$": "ts-jest"
    },
    collectCoverageFrom: [
        "<rootDir>/src/presentation/controllers/sign-up/sign-up.ts",
        "<rootDir>/src/utils/adapters/email-validator/email-validator-adapter.ts",
        "<rootDir>/src/data/use-cases/add-account/db-add-account.ts"
    ]
};

export default config;
