import { env } from "$env/dynamic/private";

export const load = () => {
    return {
        matomo: {
            url: env.MATOMO_URL,
            id: env.MATOMO_APP_ID,
        },
        posthog: {
            apiKey: env.POSTHOG_API_KEY,
            host: env.POSTHOG_HOST,
            defaults: env.POSTHOG_DEFAULTS,
        },
    };
};
