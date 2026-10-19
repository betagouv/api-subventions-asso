import type { LayoutLoad } from "./$types";
import { PUBLIC_ENV } from "$env/static/public";
import { buildBreadcrumbs } from "$lib/services/router.service";
import AuthLevels from "$lib/resources/auth/authLevels";
import { getQueryParams } from "$lib/helpers/urlHelper";
import posthog, { type ConfigDefaults } from "posthog-js";

export const ssr = false;

let posthogInitialized = false;

export const load = (({ url, params, data }) => {
    if (
        ["prod", "preprod"].includes(PUBLIC_ENV.toLowerCase()) &&
        !posthogInitialized &&
        data.posthog.apiKey &&
        data.posthog.host &&
        data.posthog.defaults
    ) {
        posthog.init(data.posthog.apiKey, {
            api_host: data.posthog.host,
            defaults: data.posthog.defaults as ConfigDefaults,
        });
        posthogInitialized = true;
    }

    return {
        query: getQueryParams(url.searchParams),
        params,
        crumbs: buildBreadcrumbs(url.pathname),
        authLevel: AuthLevels.USER,
        matomo: data.matomo ?? undefined,
        posthog: data.posthog ?? undefined,
    };
}) satisfies LayoutLoad;
