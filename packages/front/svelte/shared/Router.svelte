<script>
    import AdminUsers from "../views/admin/users/AdminUsers.svelte";
    import Association from "../views/association/Association.svelte";
    import Home from "../views/home/Home.svelte";

    export let route;
    export let searchParams;
</script>

{#if route.includes("association")}
    <Association {route} />
{:else if route.includes("/admin/users/list")}
    <AdminUsers />
{:else}
    <Home {searchParams} />
{/if}
