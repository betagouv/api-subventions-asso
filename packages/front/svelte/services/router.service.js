import {
    PAGE_ADMIN_USERS_METRICS_NAME,
    PAGE_ADMIN_USERS_ACCOUNT_NAME,
    PAGE_ADMIN_USERS_CREATE_NAME,
    PAGE_ADMIN_STATS_NAME
} from "../views/admin/admin.constant";

// TODO: rendre dynamique (via une librairie de routing ?)
export const buildBreadcrumbs = path => {
    const crumbs = [];
    if (path.includes("association")) crumbs.push({ label: `Association (${path.split("/").at(-1)})` });
    if (path.includes("etablissement")) crumbs.push({ label: `Établissement (${path.split("/").at(-1)})` });
    else if (path.includes("admin")) {
        crumbs.push({ label: "Admin", url: "/admin" });
        if (path.includes("users/list")) crumbs.push({ label: PAGE_ADMIN_USERS_ACCOUNT_NAME });
        if (path.includes("users/metrics")) crumbs.push({ label: PAGE_ADMIN_USERS_METRICS_NAME });
        if (path.includes("users/create")) crumbs.push({ label: PAGE_ADMIN_USERS_CREATE_NAME });
        if (path.includes("stats")) crumbs.push({ label: PAGE_ADMIN_STATS_NAME });
    } else if (path.includes("auth")) {
        crumbs.push({ label: "Connexion", url: "/auth/login" });
        if (path.includes("reset-password")) crumbs.push({ label: "Changement de mot de passe" });
        if (path.includes("forget-password")) crumbs.push({ label: "Mot de passe perdu" });
        if (path.includes("signup")) crumbs.push({ label: "Créer un compte" });
    }
    return crumbs;
};

export const mapSegments = path =>
    path
        .replace(/^\/+|\/+$/g, "")
        .split("/")
        .map(segment => ({
            name: segment.replace(":", ""),
            variable: segment.startsWith(":")
        }));

export const getRouteSegments = routes =>
    Object.entries(routes).map(([path, { component, needAuthentification }]) => ({
        path,
        component,
        needAuthentification,
        segments: mapSegments(path)
    }));

export const getSegments = path => path.replace(/^\/+|\/+$/g, "").split("/");

export const getRoute = (routes, path) => {
    const segments = path.replace(/^\/+|\/+$/g, "").split("/");
    return getRouteSegments(routes).find(route => {
        if (route.segments.length !== segments.length) return false;
        return segments.every((s, i) => route.segments[i].name === s || route.segments[i].variable);
    });
};

export const getProps = (path, routeSegments) => {
    let props = {};
    getSegments(path).forEach((s, i) => routeSegments[i].variable && (props[routeSegments[i].name] = s));
    return props;
};

export const goToUrl = url => {
    location.href = url;
};
