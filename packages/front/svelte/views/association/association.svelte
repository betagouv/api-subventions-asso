<script>
  import { onMount, getContext } from "svelte";
  import axios from "axios";
  import { user as userStore } from "../../store/user.store";
  import Breadcrumb from "../../dsfr/Breadcrumb.svelte";

  export let route;
  const { getApiUrl } = getContext("app");
  let apiUrl = getApiUrl();
  const token = $userStore.token;
  const segments = [{ label: "Accueil", url: "/" }, { label: `Association (${route.split("/")[1]})` }];

  let promise;

  onMount(async () => {
    promise = getAssociation();
  });

  async function getAssociation() {
    const path = `${apiUrl}/${route}`;
    return await axios.get(path, { headers: { "x-access-token": token } });
  }
</script>

<Breadcrumb {segments} />
<div>
  {#await promise}
    <p>...waiting</p>
  {:then association}
    <p>Here is your association : {association}</p>
  {:catch error}
    <p style="color: red">{error.message}</p>
  {/await}
</div>
