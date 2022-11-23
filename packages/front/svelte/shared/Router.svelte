<script>
    import Breadcrumb from "../dsfr/Breadcrumb.svelte";
    import { buildBreadcrumbs } from "../services/router.service";
    import {onMount} from "svelte";
    import * as RouterService from "../services/router.service";

    let component;
    let props;
    const crumbs = buildBreadcrumbs(location.pathname);
    export let routes = {};
    
    const LoadRoute = async () => {
        const path = location.pathname;
        const current = RouterService.getRoute(routes, path);
        props = RouterService.getProps(path, current.segments);
        component = await current.component();
    };

    onMount(() => {
        LoadRoute(location.pathname);
        window.onpopstate = () => LoadRoute();
    });
</script>

<Breadcrumb {crumbs} />
<svelte:component this={component} {...props} />