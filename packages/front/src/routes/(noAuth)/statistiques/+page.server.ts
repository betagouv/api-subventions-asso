import { redirect } from "@sveltejs/kit";
import { STATS_URL } from "$env/static/public";

export const ssr = true;

export function load() {
    throw redirect(303, STATS_URL);
}
