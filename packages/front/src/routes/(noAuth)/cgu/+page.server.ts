import { redirect } from "@sveltejs/kit";
import { CGU_URL } from "$env/static/public";

export const ssr = true;

export function load() {
    throw redirect(303, CGU_URL);
}
