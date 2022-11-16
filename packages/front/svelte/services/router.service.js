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
