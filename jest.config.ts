import { Config } from "@jest/types";

const config: Config.InitialOptions = {
    roots: ["<rootDir>/src"],
    collectCoverage: true,
    coverageDirectory: "coverage",
    testEnvironment: "node",
    preset: "@shelf/jest-mongodb",
    watchPathIgnorePatterns: ["globalConfig"],
    collectCoverageFrom: ["<rootDir>/src/**/*.ts", "!<rootDir>/src/main/**"],
    transform: {
        ".+\\.ts$": "ts-jest"
    }
};

export default config;
