// eslint-disable-next-line no-undef
module.exports = {
    // Automatically clear mock calls, instances and results before every test
    clearMocks: true,
    transform: {
        "^.+\\.svelte$": "svelte-jester",
        "^.+\\.ts?$": "ts-jest",
        "\\.jsx?$": "babel-jest"
    },
    modulePathIgnorePatterns: ["./build"],
    moduleFileExtensions: ["ts", "js", "svelte"],
    testEnvironment: "jsdom"
};
