import * as RouterService from "../../services/router.service";
import { isAdmin } from "@services/user.service";
import Store from "@core/Store";
import authService from "@resources/auth/auth.service";

export default class RouterController {
    constructor(routes) {
        this.crumbs = new Store([]);
        this.props = new Store();
        this.component = new Store();
        this.routes = routes;
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
            this.crumbs.set(RouterService.buildBreadcrumbs(path));
            const props = RouterService.getProps(path, route.segments);
            props.query = this.getQueryParams(searchQuery);
            this.props.set(props);
        }
        this.component.set(route.component());
    }

    getQueryParams(searchQuery) {
        const urlParams = new URLSearchParams(searchQuery);
        return Object.fromEntries(urlParams.entries());
    }
}
