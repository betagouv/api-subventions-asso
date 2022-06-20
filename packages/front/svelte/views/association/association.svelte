<script>
  import { onMount, getContext } from "svelte";
  import axios from "axios";
  import { user as userStore } from "../../store/user.store";
  import Breadcrumb from "../../dsfr/Breadcrumb.svelte";
  import ProviderValueHelper from "../../../src/shared/helpers/ProviderValueHelper";

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
  <h1>{association?.denomination}</h1>
  <div class="grid">
    <div>
      <div>
        <span>RNA</span>
        <p>{association?.rna}</p>
      </div>
      <div>
        <span>SIREN</span>
        <p>{association?.siren}</p>
      </div>
      <div>
        <span>SIRET du siège</span>
        <p>{association?.siren + association?.nic_siege}</p>
      </div>
    </div>
    <div>
      <span>Objet social</span>
      <p>{association?.objet_social}</p>
    </div>
    <div>
      <div>
        <span>Adresse siège</span>
        <p>{association?.adresse_siege?.code_postal} - {association?.adresse_siege?.commune}</p>
      </div>
      <div>
        <span>Date d'immatriculation</span>
        <p>{new Date(association?.date_creation).toLocaleDateString()}</p>
      </div>
      {#if association?.date_modification}
        <div>
          <span>Dernière modification au greffe</span>
          <p>{new Date(association?.date_modification).toLocaleDateString()}</p>
        </div>
      {/if}
    </div>
  </div>
{:catch error}
  <p style="color: red">{error.message}</p>
{/await}

<style>
  .grid {
    display: grid;
    grid-template-rows: auto;
    grid-template-columns: 1fr 1fr 1fr;
  }

  .grid span {
    font-weight: 700;
  }
</style>
