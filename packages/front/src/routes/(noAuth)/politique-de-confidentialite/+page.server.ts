import { redirect } from "@sveltejs/kit";
import { PRIVACY_POLICY_URL } from "$env/static/public";

export const ssr = true;

export function load() {
    throw redirect(303, PRIVACY_POLICY_URL);
}
