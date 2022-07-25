<script>
    import AdminUsers from "../views/admin/users/AdminUsers.svelte";
    import Association from "../views/association/Association.svelte";

    export let route;
    console.log(route);
</script>

{#if route.includes("association")}
    <Association {route} />
{:else if route.includes("/admin/users/list")}
    <AdminUsers />
{:else}
    Default Route
{/if}
