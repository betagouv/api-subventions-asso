import {
    PAGE_ADMIN_USERS_METRICS_NAME,
    PAGE_ADMIN_USERS_ACCOUNT_NAME,
    PAGE_ADMIN_USERS_CREATE_NAME,
    PAGE_ADMIN_STATS_NAME,
} from "../../routes/admin/admin.constant";
import { goto } from "$app/navigation";

if (![].at) {
    Array.prototype.at = function (pos) {
        return this.slice(pos, pos + 1)[0];
    };
}

// TODO: rendre dynamique (via une librairie de routing ?)
export const buildBreadcrumbs = path => {
    const crumbs = [];
    if (path.includes("mentions-legales")) crumbs.push({ label: "Mentions Légales" });
    if (path.includes("contact")) crumbs.push({ label: "Contactez-nous" });
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
        if (path.includes("reset-password")) crumbs.push({ label: "Réinitialisation de mot de passe" });
        if (path.includes("forget-password")) crumbs.push({ label: "Mot de passe perdu" });
        if (path.includes("signup")) crumbs.push({ label: "Créer un compte" });
    }
    return crumbs;
};

export const goToUrl = (url, saveHistory = true, reload = false) => {
    if (!reload && !url.includes("://")) return goto(url, { replaceState: !saveHistory });
    if (saveHistory) window.location.assign(url);
    else window.location.replace(url);
};
