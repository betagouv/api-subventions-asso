import { sentrySvelteKit } from "@sentry/sveltekit";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [sentrySvelteKit({
        sourceMapsUploadOptions: {
            org: "betagouv",
            project: "data-subvention-front",
            url: "https://sentry.incubateur.net/"
        }
    }), sveltekit()],
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
});