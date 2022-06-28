<script>
  import Tabs from "../../../dsfr/Tabs.svelte";
  import TabContent from "../../../dsfr/TabContent.svelte";
  import Etablissements from "./Etablissements.svelte";

  export let titles;
  export let associationIdentifier;
</script>

<div class="tabs-asso">
  <Tabs {titles}>
    <svelte:fragment slot="tab-content">
      {#each titles as title, index}
        <TabContent selected={index == 0} {index}>
          {#if index == 0}
            {title}
          {:else if index == 1}
            {title}
          {:else}
            <Etablissements {associationIdentifier} />
          {/if}
        </TabContent>
      {/each}
    </svelte:fragment>
  </Tabs>
</div>

<style>
  .tabs-asso :global(.fr-tabs > .fr-tabs__list) {
    justify-content: center;
  }
</style>
