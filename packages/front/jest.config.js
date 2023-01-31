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
    testEnvironment: "jsdom",
    moduleNameMapper: {
        "@resources/(.*)$": "<rootDir>/svelte/resources/$1",
        "@components/(.*)$": "<rootDir>/svelte/components/$1",
        "@core/(.*)$": "<rootDir>/svelte/core/$1",
        "@dsfr/(.*)$": "<rootDir>/svelte/dsfr/$1",
        "@helpers/(.*)$": "<rootDir>/svelte/helpers/$1",
        "@services/(.*)$": "<rootDir>/svelte/services/$1"
    }
};
