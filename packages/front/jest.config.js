// eslint-disable-next-line no-undef
module.exports = {
    // Automatically clear mock calls, instances and results before every test
    clearMocks: true,
    transform: { "\\.[jt]sx?$": "babel-jest" },
    modulePathIgnorePatterns: ["./build"],
    testEnvironment: "jsdom"
};
