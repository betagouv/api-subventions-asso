import { env } from "$env/dynamic/private";

export const load = () => {
    return {
        matomo: {
            url: env.MATOMO_URL,
            id: env.MATOMO_APP_ID,
        },
    };
};
