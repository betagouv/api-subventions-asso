<script>
  import axios from "axios";
  import { getContext } from "svelte";

  import userService from "../../src/modules/user/user.service";
  import { user as userStore } from "../store/user.store";

  import Spinner from "../components/Spinner.svelte"
  import ErrorAlert from "../components/ErrorAlert.svelte"
  
  const { getName } = getContext("app");
  const name = getName();

  async function getUser() {
    let user;
    try {
      user = (
        await axios.get("/auth/token", {
          baseURL: "",
        })
      ).data;
    } catch (e) {
      document.location.href = "/";
    }
    userStore.update((oldUser) => Object.assign(oldUser, user));
    // set header token for each requests
    axios.defaults.headers.common["x-access-token"] = user.token;
  }

  async function getRole(user) {
    const roles = (await userService.getRoles(user)).data;
    userStore.update((oldUser) => Object.assign(oldUser, { roles }));
    return roles;
  }

  async function initApp() {
    await getUser();
    return await getRole($userStore);
  }

  const promise = initApp();
</script>

<div>
  {#await promise}
    <div class="auth--spinner-container">
      <Spinner description="Connexion à {name} en cours, veuillez patienter !"/>
    </div>
  {:then}
    <slot />
  {:catch error}
    <ErrorAlert message={error.message}></ErrorAlert>
  {/await}
</div>

<style>
  .auth--spinner-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
</style>