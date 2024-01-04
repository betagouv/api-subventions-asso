import authService from "$lib/resources/auth/auth.service";

export class TrackerService {
    constructor() {
        this._paq = window._paq = window._paq || [];
    }

    init(ENV) {
        if (ENV.toLowerCase() != "prod") return;

        const user = authService.getCurrentUser();
        /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
        if (user && user._id) this._paq.push(["setUserId", user._id]);
        this._paq.push(["trackPageView"]);
        this._paq.push(["enableLinkTracking"]);
        var u = "https://matomo-datasubvention.osc-secnum-fr1.scalingo.io/";
        this._paq.push(["setTrackerUrl", u + "matomo.php"]);
        this._paq.push(["setSiteId", "1"]);
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
