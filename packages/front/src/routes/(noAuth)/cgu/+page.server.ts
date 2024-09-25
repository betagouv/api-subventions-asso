import { redirect } from "@sveltejs/kit";
import { PUBLIC_CGU_URL } from "$env/static/public";

export const ssr = true;

export function load() {
    throw redirect(303, PUBLIC_CGU_URL);
}
