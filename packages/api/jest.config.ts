const baseConfig = {
    // Automatically clear mock calls, instances and results before every test
    clearMocks: true,
    // A map from regular expressions to paths to transformers
    // transform: undefined,
    transform: {
        "\\.(ts)$": "ts-jest",
    },
    modulePathIgnorePatterns: ["./build"],
};

export default baseConfig;
