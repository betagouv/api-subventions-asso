<script>
  import { onMount } from "svelte";
  import { user as userStore } from "../../store/auth.store";
  import apiDatasubService from "../../../build/src/shared/apiDatasub.service";
  import IdentifierHelper from "../../../build/src/shared/helpers/IdentifierHelper";

  let identifier = document.getElementById("svelte-association").getAttribute("data-identifier");

  let user;
  let promise;

  onMount(async () => {
    user = $userStore;
    promise = getUserToken();
  });

  async function getUserToken() {
    if (IdentifierHelper.isRna(identifier)) apiDatasubService.searchAssoByRna(identifier);
    else apiDatasubService.searchAssoBySiren(identifier, user);
  }
</script>

<div>
  {#await promise}
    <p>...waiting</p>
  {:then association}
    <p>Here is your association : {association}</p>
  {:catch error}
    <p style="color: red">{error.message}</p>
  {/await}
</div>
