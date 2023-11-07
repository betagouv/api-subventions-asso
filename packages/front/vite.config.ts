import { fileURLToPath } from "url";
import { readFileSync } from "fs";
import { sentrySvelteKit } from "@sentry/sveltekit";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig, loadEnv } from "vite";

const file = fileURLToPath(new URL("package.json", import.meta.url));
const json = readFileSync(file, "utf8");
const pkg = JSON.parse(json);

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");
    return {
        plugins: [
            sentrySvelteKit({
                sourceMapsUploadOptions: {
                    org: "betagouv",
                    project: "data-subvention-front",
                    url: "https://sentry.incubateur.net/",
                    authToken: env.SENTRY_AUTH_TOKEN || env.SENTRY_AUTH_TOKEN,
                    release: pkg.version
                },
            }),
            sveltekit(),
        ],
        test: {
            include: ["src/**/*.{test,spec}.{js,ts}"],
            globals: true,
            environment: "jsdom",
            clearMocks: true,
            setupFiles: ["src/setuptest.ts"],
        },
        optimizeDeps: {
            include: ["dto"],
        },
        build: {
            commonjsOptions: {
                include: [/dto/, /node_modules/],
            },
        },
    };
});
