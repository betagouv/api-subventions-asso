<!-- Matomo -->
<script>
    import authService from "$lib/resources/auth/auth.service";

    const user = authService.getCurrentUser();
    var _paq = (window._paq = window._paq || []);
    /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
    if (user && user._id) _paq.push(["setUserId", user._id]);
    _paq.push(["trackPageView"]);
    _paq.push(["enableLinkTracking"]);
    (function () {
        var u = "https://stats.data.gouv.fr/";
        _paq.push(["setTrackerUrl", u + "matomo.php"]);
        _paq.push(["setSiteId", "256"]);
        var d = document,
            g = d.createElement("script"),
            s = d.getElementsByTagName("script")[0];
        g.async = true;
        g.src = u + "matomo.js";
        s.parentNode.insertBefore(g, s);
    })();
</script>

<!-- End Matomo Code -->
