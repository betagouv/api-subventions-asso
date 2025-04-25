import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import importPlugin from "eslint-plugin-import";
import prettier from "eslint-config-prettier";
import vitest from "eslint-plugin-vitest";
import svelte from "eslint-plugin-svelte";
import vitestGlobals from "eslint-config-vitest-globals/flat";
import svelteConfig from "./svelte.config.js";

const ignores = [
    // Sure, let's lint our lint config... :D
    // ./eslint.config.js
    ".DS_Store",
    ".env",
    ".env.*",
    ".github",
    ".svelte-kit/**/*",
    ".vscode",
    "node_modules/**/*",
    "build/**/*",
    "package/**/*",
    "**/static",

    // Ignore files for PNPM, NPM and YARN
    "pnpm-lock.yaml",
    "package-lock.json",
    "yarn.lock",
];

export default [
    { ignores },
    {
        files: ["**/*.svelte", "**/*.test.ts"],
        rules: {
            "no-unused-expressions": "off",
        },
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    ...svelte.configs.recommended,
    ...svelte.configs["flat/recommended"],
    prettier,
    ...svelte.configs["flat/prettier"],
    vitest.configs.recommended,
    vitestGlobals(),
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node, // Add this if you are using SvelteKit in non-SPA mode
            },
        },
        settings: {
            svelte: {
                // Specifies an array of rules to ignore reports within the template.
                // For example, use this to disable rules in the template that may produce unavoidable false positives.
                ignoreWarnings: ["svelte/no-at-html-tags"],
            },
        },
    },
    {
        files: ["**/*.svelte"],
        languageOptions: {
            parserOptions: {
                parser: tseslint.parser,
                projectService: true,
                extraFileExtensions: [".svelte"], // Add support for additional file extensions, such as .svelte

                // We recommend importing and specifying svelte.config.js.
                // By doing so, some rules in eslint-plugin-svelte will automatically read the configuration and adjust their behavior accordingly.
                // While certain Svelte settings may be statically loaded from svelte.config.js even if you don’t specify it,
                // explicitly specifying it ensures better compatibility and functionality.
                svelteConfig,
            },
        },
    },
    {
        files: ["**/*.ts"],
        languageOptions: {
            parser: tseslint.parser,
        },
    },
    {
        plugins: {
            "@typescript-eslint": tseslint.plugin,
            import: importPlugin,
        },
    },
];
