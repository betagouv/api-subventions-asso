<script>
    import NotFound from "$lib/components/errors/NotFound.svelte";
    import { page } from "$lib/store/kit.store";
</script>

{#if $page.status === 404}
    <NotFound />
{:else}
    <h1>{$page.status}</h1>
    <p>{$page.error?.message}</p>
{/if}
