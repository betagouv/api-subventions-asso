import { env } from "$env/dynamic/private";

export const load = () => {
    console.log("MATOMO_URL:", env.MATOMO_URL);
    console.log("MATOMO_APP_ID:", env.MATOMO_APP_ID);
    return {
        matomo: {
            url: env.MATOMO_URL,
            id: env.MATOMO_APP_ID,
        },
    };
};
