import Association from "./views/association/Association.svelte";
import Etablissement from "./views/etablissement/Etablissement.svelte";
import AdminUsersAccount from "./views/admin/users/AdminUsersAccount.svelte";
import AdminCreate from "./views/admin/users/AdminCreate.svelte";
import Home from "./views/home/Home.svelte";
import AdminUsersMetrics from "./views/admin/users/AdminUsersMetrics.svelte";
import Admin from "./views/admin/Admin.svelte";
import AdminStats from "./views/admin/stats/AdminStats.svelte";

export default {
    "association/:id": () => Association,
    "etablissement/:id": () => Etablissement,
    "admin/users/list": () => AdminUsersAccount,
    "admin/users/create": () => AdminCreate,
    "admin/users/metrics": () => AdminUsersMetrics,
    "admin/stats": () => AdminStats,
    admin: () => Admin,
    "/": () => Home
};
