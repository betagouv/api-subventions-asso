<script>
    import axios from "axios";
    import { getContext } from "svelte";

    import { user as userStore } from "../store/user.store";

    import Spinner from "./Spinner.svelte";
    import ErrorAlert from "./ErrorAlert.svelte";

    const { getName } = getContext("app");
    const name = getName();

    async function getUser() {
        let user;
        try {
            user = (
                await axios.get("/auth/user", {
                    baseURL: ""
                })
            ).data;
        } catch (e) {
            document.location.href = "/";
        }
        userStore.update(oldUser => Object.assign(oldUser, user));
        // set header token for each requests
        axios.defaults.headers.common["x-access-token"] = user.jwt.token;
    }

    const promise = getUser();
</script>

<div>
    {#await promise}
        <div class="auth--spinner-container">
            <Spinner description="Connexion à {name} en cours, veuillez patienter !" />
        </div>
    {:then}
        <slot />
    {:catch error}
        <ErrorAlert message={error.message} />
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
