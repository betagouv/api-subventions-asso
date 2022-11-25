import Association from "./views/association/Association.svelte";
import Etablissement from "./views/etablissement/Etablissement.svelte";
import AdminUsers from "./views/admin/users/AdminUsers.svelte";
import AdminCreate from "./views/admin/users/AdminCreate.svelte";
import Home from "./views/home/Home.svelte";
import AdminDomains from "./views/admin/domains/AdminDomains.svelte";
import Admin from "./views/admin/Admin.svelte";

export default {
    "association/:id": () => Association,
    "etablissement/:id": () => Etablissement,
    "admin/users/list": () => AdminUsers,
    "admin/users/create": () => AdminCreate,
    "admin/users/domain": () => AdminDomains,
    admin: () => Admin,
    "/": () => Home
};
