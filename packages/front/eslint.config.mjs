import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import importPlugin from "eslint-plugin-import";
import prettier from "eslint-config-prettier";
import vitest from "eslint-plugin-vitest";
import svelte from "eslint-plugin-svelte";
import svelteConfig from "./svelte.config.js";

const ignores = [
    "eslint.config.mjs",
    "vite.config.ts",
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
    "**/*.md",
    "pnpm-lock.yaml",
    "package-lock.json",
    "yarn.lock",
];

export default [
    { ignores },

    // Base JS + TS
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    // JS files — no type-aware linting needed
    {
        files: ["**/*.js"],
        ...tseslint.configs.disableTypeChecked,
    },

    // Svelte (flat config variants only)
    ...svelte.configs["flat/recommended"],
    ...svelte.configs["flat/prettier"],

    // Prettier (must come after other style rules)
    prettier,

    // Vitest
    vitest.configs.recommended,

    // Global language options
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                ...vitest.environments.env.globals,
            },
        },
        plugins: {
            "@typescript-eslint": tseslint.plugin,
            import: importPlugin,
        },
        settings: {
            svelte: {
                ignoreWarnings: ["svelte/no-at-html-tags"],
            },
        },
    },

    // Svelte files — parser + project service
    {
        files: ["**/*.svelte"],
        languageOptions: {
            parserOptions: {
                parser: tseslint.parser,
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
                extraFileExtensions: [".svelte"],
                svelteConfig,
            },
        },
    },

    // Shared rule overrides
    {
        rules: {
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    ignoreRestSiblings: true,
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                },
            ],
            "svelte/require-each-key": "warn",
        },
    },

    // Rules that need to be off for specific file types
    {
        files: ["**/*.svelte", "**/*.test.ts"],
        rules: {
            "no-unused-expressions": "off",
        },
    },
];
