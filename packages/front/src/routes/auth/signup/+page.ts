import { redirect } from "@sveltejs/kit";

export const ssr = true;

export function load() {
    throw redirect(301, "/");
}
