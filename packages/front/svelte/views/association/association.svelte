<script>
  import { onMount, getContext } from "svelte";
  import axios from "axios";
  import { user as userStore } from "../../store/user.store";
  import Breadcrumb from "../../dsfr/Breadcrumb.svelte";
  import ProviderValueHelper from "../../../src/shared/helpers/ProviderValueHelper";
  import InfosLegales from "./InfosLegales.svelte";
  import Tabs from "../../dsfr/Tabs.svelte";
  import TabContent from "../../dsfr/TabContent.svelte";
  import Tab from "../../dsfr/Tab.svelte";

  const tabNames = ["Tableau de bord des subventions", "Pièces administratives", "Établissement"];
  export let route;
  const { getApiUrl } = getContext("app");
  let apiUrl = getApiUrl();
  const token = $userStore.token;
  const segments = [{ label: "Accueil", url: "/" }, { label: `Association (${route.split("/")[1]})` }];

  let promise;

  onMount(async () => {
    promise = getAssociation();
    console.log({ promise });
  });

  function getAssociation() {
    const path = `${apiUrl}/${route}`;
    return axios.get(path, { headers: { "x-access-token": token } }).then((result) => {
      const association = result.data.association;
      Object.keys(result.data.association).map((key) => (association[key] = ProviderValueHelper.getValue(association[key])));
      return association;
    });
  }
</script>

<Breadcrumb {segments} />
{#await promise}
  <p>Fetching association...</p>
{:then association}
  {#if association}
    <InfosLegales {association} />
    <div class="tab-asso">
      <Tabs titles={tabNames} class="tab-asso">
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
  {/if}
{:catch error}
  <p style="color: red">{error.message}</p>
{/await}

<style>
  .tab-asso :global(.fr-tabs > .fr-tabs__list) {
    justify-content: center;
  }
</style>
