// TODO: rendre dynamique (via une librairie de routing ?)
export const buildBreadcrumbs = path => {
    const crumbs = [];
    if (path.includes("association")) crumbs.push({ label: `Association (${path.split("/").at(-1)})` });
    else if (path.includes("admin")) {
        crumbs.push({ label: "Admin", url: "/admin" });
        if (path.includes("users/list")) crumbs.push({ label: "Liste des utilisateurs" });
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
    Object.entries(routes).map(([path, component]) => ({
        path,
        component,
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
