<script>
    import { getContext } from "svelte";

    import Spinner from "../Spinner.svelte";
    import ErrorAlert from "../ErrorAlert.svelte";
    import AuthController from "./Auth.controller";

    const { getName } = getContext("app");
    const name = getName();

    const controller = new AuthController();
    const promise = controller.initCurrentUserInApp();
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
