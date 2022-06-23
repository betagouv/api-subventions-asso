<script>
  import associationService from "../../services/association.service.js";
  import Breadcrumb from "../../dsfr/Breadcrumb.svelte";
  import InfosLegales from "./InfosLegales.svelte";
  import Tabs from "../../dsfr/Tabs.svelte";
  import TabContent from "../../dsfr/TabContent.svelte";

  export let route = "";
  const id = route.split("/")[1];

  let promise = associationService.getAssociation(id);

  const tabNames = ["Tableau de bord des subventions", "Pièces administratives", "Établissements"];
  const segments = [{ label: "Accueil", url: "/" }, { label: `Association (${id})` }];
</script>

<Breadcrumb {segments} />
{#await promise}
  <p>Fetching association...</p>
{:then association}
  <InfosLegales {association} />
  <div class="tab-asso">
    <Tabs titles={tabNames}>
      <svelte:fragment slot="tab-content">
        {#each tabNames as tab, index}
          {#if index === 0}
            <TabContent selected={true} {index}>{tab}</TabContent>
          {:else}
            <TabContent selected={false} {index}>{tab}</TabContent>
          {/if}
        {/each}
      </svelte:fragment>
    </Tabs>
  </div>
{:catch error}
  <p style="color: red">{error.message}</p>
{/await}

<style>
  .tab-asso :global(.fr-tabs > .fr-tabs__list) {
    justify-content: center;
  }
</style>
