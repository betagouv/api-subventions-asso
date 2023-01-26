import Association from "./views/association/Association.svelte";
import Etablissement from "./views/etablissement/Etablissement.svelte";
import AdminUsersAccount from "./views/admin/users/AdminUsersAccount.svelte";
import AdminUsersCreate from "./views/admin/users/AdminUsersCreate.svelte";
import Home from "./views/home/Home.svelte";
import AdminUsersMetrics from "./views/admin/users/AdminUsersMetrics.svelte";
import Admin from "./views/admin/Admin.svelte";
import AdminStats from "./views/admin/stats/AdminStats.svelte";
import Signup from "./views/auth/signup/Signup.svelte";

export default {
    "association/:id": () => Association,
    "etablissement/:id": () => Etablissement,
    "admin/users/list": () => AdminUsersAccount,
    "admin/users/create": () => AdminUsersCreate,
    "admin/users/metrics": () => AdminUsersMetrics,
    "admin/stats": () => AdminStats,
    admin: () => Admin,
    "/": () => Home,
    "auth/signup": () => Signup
};
