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

    // npm
    "node_modules/**/*",
    "package-lock.json",

    // specific modules => document why we need this ?
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
];
