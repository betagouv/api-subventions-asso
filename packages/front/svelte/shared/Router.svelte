<script>
    import AdminUsers from "../views/admin/users/AdminUsers.svelte";
    import Association from "../views/association/Association.svelte";
    import Home from "../views/home/Home.svelte";
    import { path } from "../store/url.store";
    import { buildBreadcrumbs } from "../services/router.service";
    import Breadcrumb from "../dsfr/Breadcrumb.svelte";

    $: crumbs = buildBreadcrumbs($path)

    export let searchParams;
</script>

<Breadcrumb {crumbs} />
{#if $path.includes("association")}
    <Association />
{:else if $path.includes("admin")}
    <AdminUsers />
{:else}
    <Home {searchParams} />
{/if}
