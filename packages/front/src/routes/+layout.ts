import type { LayoutLoad } from "./$types";
import { buildBreadcrumbs } from "$lib/services/router.service";
import AuthLevels from "$lib/resources/auth/authLevels";
import { getQueryParams } from "$lib/helpers/urlHelper";

export const ssr = false;

export const load = (({ url, params }) => {
    return {
        query: getQueryParams(url.searchParams),
        params,
        crumbs: buildBreadcrumbs(url.pathname),
        authLevel: AuthLevels.USER,
    };
}) satisfies LayoutLoad;
