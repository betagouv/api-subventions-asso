<script>
    import { onMount } from "svelte";

    import Breadcrumb from "../../dsfr/Breadcrumb.svelte";
    import RouterController from "./Router.controller";

    export let routes = {};

    const controller = new RouterController(routes);

    const { crumbs, component, props, query } = controller;

    onMount(() => {
        controller.loadRoute(location.pathname, location.search);
    });
</script>

<Breadcrumb crumbs={$crumbs} />
<svelte:component this={$component} {...$props} query={$query} />
