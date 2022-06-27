<script>
  import Association from "../views/association/Association.svelte";
  export let route;
</script>

{#if route.includes("association")}
  <Association {route} />
{:else}
  Default Route
{/if}
