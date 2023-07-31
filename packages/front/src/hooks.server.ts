import type { Handle } from "@sveltejs/kit";

export const handle = (async ({ event, resolve }) => {
    event.setHeaders({
        "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
        "X-Frame-Options": "SAMEORIGIN",
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "max-age 1800",
    });
    return resolve(event);
}) satisfies Handle;
