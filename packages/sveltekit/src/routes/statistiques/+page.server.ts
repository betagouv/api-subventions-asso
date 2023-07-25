import { STATS_URL } from '$env/static/public';
import { redirect } from '@sveltejs/kit';

export const ssr = true

export function load() {
      throw redirect(303, STATS_URL);
}
