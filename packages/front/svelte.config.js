import "dotenv/config";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import adapter from "@sveltejs/adapter-node";
import { vitePreprocess } from "@sveltejs/kit/vite";

const file = fileURLToPath(new URL("package.json", import.meta.url));
const json = readFileSync(file, "utf8");
const pkg = JSON.parse(json);

/** @type {import("@sveltejs/kit").Config} */
const config = {
    // Consult https://kit.svelte.dev/docs/integrations#preprocessors
    // for more information about preprocessors
    preprocess: vitePreprocess(),

    kit: {
        // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
        // If your environment is not supported or you settled on a specific environment, switch out the adapter.
        // See https://kit.svelte.dev/docs/adapters for more information about adapters.
        adapter: adapter({ out: "build" }),
        env: {
            publicPrefix: "",
            privatePrefix: "PRIVATE_",
        },
        version: { name: pkg.version },
        csp: {
            directives: {
                "default-src": ["self"],
                "connect-src": [
                    "self",
                    process.env.DATASUB_URL || "http://localhost:8080",
                    "https://client.crisp.chat/ wss://client.relay.crisp.chat/w/b1/",
                    "https://storage.crisp.chat",
                    "wss://stream.relay.crisp.chat",
                    "https://stats.data.gouv.fr",
                ],
                "font-src": ["self", "https://client.crisp.chat"],
                "img-src": [
                    "self",
                    "data: https://image.crisp.chat",
                    "https://client.crisp.chat",
                    "https://storage.crisp.chat",
                ],
                "script-src": [
                    "unsafe-inline",
                    "unsafe-eval",
                    "self",
                    "https://client.crisp.chat",
                    "https://settings.crisp.chat",
                    "https://stats.data.gouv.fr",
                ],
                "style-src": ["self", "https://client.crisp.chat", "unsafe-inline"],
                "frame-src": ["self", "https://game.crisp.chat"],
            },
        },
    },
};

export default config;
