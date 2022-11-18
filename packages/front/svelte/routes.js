import Association from "./views/association/Association.svelte";
import AdminUsers from "./views/admin/users/AdminUsers.svelte";
import Home from "./views/home/Home.svelte";

export default {
    "association/:id": () => Association,
    "admin/users/list": () => AdminUsers,
    "/": () => Home
};
