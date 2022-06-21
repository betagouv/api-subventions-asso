<script>
  import Tab from "./Tab.svelte";
  export let titles;
</script>

<div class="fr-tabs">
  <ul class="fr-tabs__list" role="tablist" aria-label="Système d'onglet">
    {#each titles as title, index}
      {#if index === 0}
        <Tab {title} {index} selected={true} />
      {:else}
        <Tab {title} {index} />
      {/if}
    {/each}
  </ul>
  <slot name="tab-content" />
</div>
