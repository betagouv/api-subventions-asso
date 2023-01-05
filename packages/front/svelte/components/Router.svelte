<script>
    import { onMount } from "svelte";
    import { user as userStore } from "../store/user.store";
    import { buildBreadcrumbs } from "../services/router.service";
    import * as RouterService from "../services/router.service";

    import Breadcrumb from "../dsfr/Breadcrumb.svelte";
    import { isAdmin } from "../services/user.service";

    let component;
    let props;
    const crumbs = buildBreadcrumbs(location.pathname);
    export let routes = {};

    const loadRoute = async () => {
        let path = location.pathname;
        if (path.includes("admin") && !isAdmin($userStore)) path = "/";
        const current = RouterService.getRoute(routes, path);
        props = RouterService.getProps(path, current.segments);
        component = await current.component();
    };

    onMount(() => {
        loadRoute(location.pathname);
        // window.onpopstate = () => loadRoute();
    });
</script>

<Breadcrumb {crumbs} />
<svelte:component this={component} {...props} />
