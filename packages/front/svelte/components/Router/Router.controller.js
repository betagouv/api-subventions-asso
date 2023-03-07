import * as RouterService from "../../services/router.service";
import { isAdmin } from "../../services/user.service";
import Store from "@core/Store";
import authService from "@resources/auth/auth.service";

export default class RouterController {
    constructor(routes) {
        this.crumbs = new Store([]);
        this.props = new Store();
        this.component = new Store();
        this.query = new Store({});
        this.routes = routes;
    }

    loadRoute(path, searchQuery) {
        let route = RouterService.getRoute(this.routes, path);
        if (!route) route = RouterService.getRoute(this.routes, "/404");
        if (!route.disableAuth) {
            const user = authService.getCurrentUser();

            if (!user || !user._id) return RouterService.goToUrl("/auth/login");
            if (path.includes("admin") && !isAdmin(user)) return RouterService.goToUrl("/");
        }
        this.query.set(this.getQueryParams(searchQuery));
        this.crumbs.set(RouterService.buildBreadcrumbs(path));
        this.props.set(RouterService.getProps(path, route.segments));
        this.component.set(route.component());
    }

    getQueryParams(searchQuery) {
        const urlParams = new URLSearchParams(searchQuery);
        return Object.fromEntries(urlParams.entries());
    }
}
