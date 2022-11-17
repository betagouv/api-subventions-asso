<script>
    import Breadcrumb from "../dsfr/Breadcrumb.svelte";
    import { buildBreadcrumbs } from "../services/router.service";
    import { path } from "../store/url.store";
    
    import {onMount} from "svelte";
    let component;
    const crumbs = buildBreadcrumbs($path)
    export let routes = {};
    
    const LoadRoute = async(path) => {
        const current = getRoute(path);
        props = getProps(path, current.segments);
        component = await current.component();
    };

    onMount(() => {
        _routes = getRouteSegments(routes);
        LoadRoute($path);
    });
</script>

<script context="module">
    let _routes = {};
    let props = {};

    export const mapSegments = path => path
            .replace(/^\/+|\/+$/g, '')
            .split('/')
            .map(segment => ({
                name: segment.replace(':', ''),
                variable: segment.startsWith(':')
            }))

    const getRouteSegments = routes =>
        Object.entries(routes).map(([path, component]) => ({
            path,
            component,
            segments: mapSegments(path)
    }));

    const getRoute = path => {
        const segments = path.replace(/^\/+|\/+$/g, '').split('/');
        return _routes.find(route => {
        if(route.segments.length !== segments.length) return false;
        return segments.every((s, i) =>
            route.segments[i].name === s ||
            route.segments[i].variable
        );
        });
    };
    
    const getProps = (path, routeSegments) => {
        let props = {};
        const segments = path.replace(/^\/+|\/+$/g, '').split('/');
        segments.map((s, i) =>
            routeSegments[i].variable &&
            (props[routeSegments[i].name] = s)
        );
        return props;
    };

    // À utiliser lorsqu'on passera en 100% svelte (plus de redirection directe d'URL)
    export const navigate = path => {
        window.history.pushState(null, null, path);
        LoadRoute(path);
    };

    window.onpopstate = () => LoadRoute(location.pathname);
</script>

<Breadcrumb {crumbs} />
<svelte:component this={component} {...props} />