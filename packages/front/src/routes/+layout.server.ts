import { MATOMO_URL, MATOMO_APP_ID } from "$env/static/private";

export const load = () => {
    return {
        matomo: {
            url: MATOMO_URL,
            id: MATOMO_APP_ID,
        },
    };
};
