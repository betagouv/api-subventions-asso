import posthog from "posthog-js";

export class TrackerService {
    init(ENV, config) {
        this.initPosthog(ENV, config.posthog);
    }

    initPosthog(ENV, POSTHOG_ENV) {
        // Setup POSTHOG_* env only on preprod & prod
        if (!POSTHOG_ENV.apiKey || !POSTHOG_ENV.host || !POSTHOG_ENV.defaults) {
            console.warn("PostHog is not configured.");
            return;
        }

        posthog.init(POSTHOG_ENV.apiKey, {
            api_host: POSTHOG_ENV.host,
            defaults: POSTHOG_ENV.defaults,
        });
    }

    registerPosthogUserProperties(user) {
        posthog.register({
            user_roles: user.roles,
            agent_type: user.agentType,
        });
    }
}

const trackerService = new TrackerService();

export default trackerService;
