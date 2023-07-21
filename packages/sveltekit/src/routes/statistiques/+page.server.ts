import { redirect } from '@sveltejs/kit';
import { STATS_URL } from "$lib/config";

export const ssr = true

export function load() {
      throw redirect(303, STATS_URL);
}
