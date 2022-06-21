<script>
  import { onMount, getContext } from "svelte";
  import axios from "axios";
  import { user as userStore } from "../../store/user.store";
  import Breadcrumb from "../../dsfr/Breadcrumb.svelte";
  import ProviderValueHelper from "../../../src/shared/helpers/ProviderValueHelper";
  import InfosLegales from "./InfosLegales.svelte";

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
  {/if}
{:catch error}
  <p style="color: red">{error.message}</p>
{/await}

<style>
</style>
