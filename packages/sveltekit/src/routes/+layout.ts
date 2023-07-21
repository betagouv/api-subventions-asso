import { buildBreadcrumbs } from "$lib/services/router.service";

export const ssr = false;

export function load({ url, params }) {
	return {
		query: getQueryParams(url.searchParams),
		params,
		crumbs: buildBreadcrumbs(url.pathname)
	};
}

function getQueryParams(searchQuery) {
	const urlParams = new URLSearchParams(searchQuery);
	return Object.fromEntries(urlParams.entries());
}
