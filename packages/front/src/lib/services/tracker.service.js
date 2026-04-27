import authService from "$lib/resources/auth/auth.service";

export class TrackerService {
    constructor() {
        this._paq = window._paq = window._paq || [];
    }

    init(ENV, MATOMO_ENV) {
        if (ENV.toLowerCase() != "prod") return;

        if (!MATOMO_ENV.url || !MATOMO_ENV.id) console.warn("Matomo is not configured.");
        var u = MATOMO_ENV.url;
        this._paq.push(["setTrackerUrl", u + "matomo.php"]);
        this._paq.push(["setSiteId", MATOMO_ENV.id]);
        const user = authService.getCurrentUser();
        /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
        if (user && user._id) this._paq.push(["setUserId", user._id]);
        this._paq.push(["enableLinkTracking"]);
        this._paq.push(["trackPageView"]);

        var d = document,
            g = d.createElement("script"),
            s = d.getElementsByTagName("script")[0];
        g.async = true;
        g.src = u + "matomo.js";
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
