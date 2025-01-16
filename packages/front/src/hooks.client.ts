import { handleErrorWithSentry } from "@sentry/sveltekit";
import * as Sentry from "@sentry/sveltekit";
import { PUBLIC_ENV } from "$env/static/public";
import { version } from "$app/environment";

if (PUBLIC_ENV !== "dev")
    Sentry.init({
        dsn: "https://5d47efb730804541a53e916f0bd27cea@sentry.incubateur.net/101",
        tracesSampleRate: 1.0,

        // This sets the sample rate to be 10%. You may want this to be 100% while
        // in development and sample at a lower rate in production
        replaysSessionSampleRate: 0.1,

        // If the entire session is not sampled, use the below sample rate to sample
        // sessions when an error occurs.
        replaysOnErrorSampleRate: 1.0,

        environment: PUBLIC_ENV,
        release: version,
    });

// If you have a custom error handler, pass it to `handleErrorWithSentry`
export const handleError = handleErrorWithSentry();
