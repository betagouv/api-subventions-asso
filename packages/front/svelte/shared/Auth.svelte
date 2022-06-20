<script>
  import axios from "axios";
  import UserService from "../../src/modules/user/user.service";
  import { user as userStore } from "../store/user.store";

  async function getUser() {
    let user;
    try {
      user = (await axios.get("/auth/token")).data;
    } catch (e) {
      document.location.href = "/";
    }
    userStore.update((oldUser) => Object.assign(oldUser, user));
  }

  async function getRole(user) {
    const roles = (await UserService.getRoles(user)).data;
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
    spinning...
  {:then}
    <slot />
  {/await}
</div>
