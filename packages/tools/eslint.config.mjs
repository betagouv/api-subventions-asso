import eslint from "@eslint/js";
import globals from "globals";
import importPlugin from "eslint-plugin-import";
import prettier from "eslint-config-prettier";

const ignores = [
    // config files
    // Sure, let's lint our lint config... :D
    // ./eslint.config.js
    ".DS_Store",
    ".env",
    ".env.*",
    ".github",
    ".vscode",

    // all .md files
    "**/*.md",

    // npm
    "node_modules/**/*",
    "package-lock.json",

    // specific modules => document why do we need this ?
    "osiris-automation/cleaned_modules/**/*",
];

export default [
    { ignores },
    eslint.configs.recommended,
    importPlugin.flatConfigs.recommended,
    prettier,
    {
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.browser,
            },
        },
    },
    {
        files: ["**/*.{js}"],
        languageOptions: {
            parser: eslint.parser,
        },
    },
    {
        rules: {
            "no-unused-vars": [
                "error",
                {
                    ignoreRestSiblings: true,
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    // for unknown reason, .js files in tools doesn't allow catch without error parameter
                    caughtErrorsIgnorePattern: "^_",
                },
            ],
        },
    },
];
