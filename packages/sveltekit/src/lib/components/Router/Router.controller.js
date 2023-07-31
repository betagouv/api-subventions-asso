import * as RouterService from "$lib/services/router.service";
import { isAdmin } from "$lib/services/user.service";
import Store from "$lib/core/Store";
import authService from "$lib/resources/auth/auth.service";

export default class RouterController {
    constructor() {
        this.props = new Store();
        this.component = new Store();
    }

    loadRoute(path, searchQuery) {
        let route = RouterService.getRoute(this.routes, path);
        if (!route) {
            route = RouterService.getRoute(this.routes, "/404");
            this.crumbs.set(RouterService.buildBreadcrumbs("/404"));
        } else {
            if (!route.disableAuth) {
                const user = authService.getCurrentUser();

                const queryUrl = encodeURIComponent(location.pathname);
                if (!user || !user._id) return RouterService.goToUrl(`/auth/login?url=${queryUrl}`);
                if (path.includes("admin") && !isAdmin(user)) return RouterService.goToUrl("/");
            }
        }
    }

    getQueryParams(searchQuery) {
        const urlParams = new URLSearchParams(searchQuery);
        return Object.fromEntries(urlParams.entries());
    }
}