import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
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

    // TS builds
    "build/**/*",
    "tsoa/**/*",

    // other project folders
    "data/integration/**/*",
    "import-errors/**/*",
    "logs/**/*",

    // all .md files
    "**/*.md",

    // npm
    "node_modules/**/*",
    "package-lock.json",
];

export default [
    { ignores },
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    importPlugin.flatConfigs.recommended,
    prettier,
    {
        rules: {
            "no-unused-vars": ["off"],
            "@typescript-eslint/no-unused-vars": [
                "error",
                { ignoreRestSiblings: true, argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
            ],
        },
    },
    {
        files: ["migrations/**/*.js"],
        rules: {
            "@typescript-eslint/no-require-imports": "off",
        },
    },
    {
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
    },
    {
        files: ["**/*.{js,ts}"],
        languageOptions: {
            parser: tseslint.parser,
        },
    },
    {
        files: ["**/*.test.ts", "**/*.spec.ts"],
        languageOptions: {
            parser: tseslint.parser,
            globals: {
                ...globals.jest,
            },
        },
    },
    {
        settings: {
            "import/resolver": {
                typescript: {
                    alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
                },
            },
        },
    },
    {
        plugins: {
            "@typescript-eslint": tseslint.plugin,
        },
    },
];
