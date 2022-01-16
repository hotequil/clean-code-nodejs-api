export default {
    roots: ["<rootDir>/src"],
    collectCoverageFrom: ["<rootDir>/src/presentation/controllers/*.ts"],
    collectCoverage: true,
    coverageDirectory: "coverage",
    testEnvironment: "node",
    transform: {
        ".+\\.ts$": "ts-jest"
    }
};
