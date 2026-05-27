import authService from "$lib/resources/auth/auth.service";

export class TrackerService {
    constructor() {
        this._paq = window._paq = window._paq || [];
    }

    init(ENV, MATOMO_ENV) {
        console.log(`initializing matomo on ${ENV} environment`);

        if (ENV.toLowerCase() != "prod") return;
        if (!MATOMO_ENV.url || !MATOMO_ENV.id) console.warn("Matomo is not configured.");

        console.log(`setting url ${MATOMO_ENV.url} for app id ${MATOMO_ENV.id}`);

        this._paq.push(["setTrackerUrl", `${MATOMO_ENV.url}matomo.php`]);
        this._paq.push(["setSiteId", MATOMO_ENV.id]);

        // tracker methods like "setCustomDimension" should be called before "trackPageView"
        const user = authService.getCurrentUser();
        if (user && user._id) this._paq.push(["setUserId", user._id]);
        this._paq.push(["enableLinkTracking"]);
        this._paq.push(["trackPageView"]);

        const g = document.createElement("script");
        g.async = true;
        g.src = `${MATOMO_ENV.url}matomo.js`;

        const s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(g, s);
    }

    /**
     * Track event allows you to track an event in our tracking tool
     *
     * @param {string[]} args params for identify event
     */
    trackEvent(...args) {
        window._paq.push(["trackEvent", ...args]);
    }

    buttonClickEvent(eventName, ...args) {
        this.trackEvent(eventName, ...args);
    }
}

const trackerService = new TrackerService();

export default trackerService;
