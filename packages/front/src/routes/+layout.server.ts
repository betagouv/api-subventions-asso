import { env } from "$env/dynamic/private";

export const load = () => {
    return {
        posthog: {
            apiKey: env.POSTHOG_API_KEY,
            host: env.POSTHOG_HOST,
            defaults: env.POSTHOG_DEFAULTS,
        },
    };
};
