import { Config } from "@jest/types";

const config: Config.InitialOptions = {
    roots: ["<rootDir>/src"],
    collectCoverage: true,
    coverageDirectory: "coverage",
    testEnvironment: "node",
    preset: "@shelf/jest-mongodb",
    watchPathIgnorePatterns: ["globalConfig"],
    collectCoverageFrom: [
        "<rootDir>/src/**/*.ts",
        "!<rootDir>/src/main/**",
        "!<rootDir>/src/utils/tests/**"
    ],
    transform: {
        ".+\\.ts$": "ts-jest"
    },
    moduleNameMapper: {
        "@/(.*)": "<rootDir>/src/$1"
    }
};

export default config;
