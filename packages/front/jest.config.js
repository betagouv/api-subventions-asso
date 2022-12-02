// eslint-disable-next-line no-undef
module.exports = {
    // Automatically clear mock calls, instances and results before every test
    clearMocks: true,
    transform: {
        "^.+\\.ts?$": "ts-jest",
        "\\.jsx?$": "babel-jest"
    },
    modulePathIgnorePatterns: ["./build"],
    moduleFileExtensions: ["ts", "js"],
    testEnvironment: "jsdom"
};
