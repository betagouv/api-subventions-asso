<script>
    import { PAGE_ADMIN_USERS_CREATE_NAME } from "../../admin.constant";
    import adminService from "../../admin.service";
    import Alert from "$lib/dsfr/Alert.svelte";
    import Button from "$lib/dsfr/Button.svelte";
    import Input from "$lib/dsfr/Input.svelte";

    let email;
    let error = false;

    const createUser = () => {
        error = false;
        adminService.create(email).catch(() => (error = true));
    };
</script>

{#if error}
    <Alert title="L'adresse n'est pas valide ou est déjà liée à un compte utilisateur" />
{/if}

<h2>{PAGE_ADMIN_USERS_CREATE_NAME}</h2>
<div class="input-layout">
    <Input label="Email" bind:value={email} />
</div>
<Button on:click={createUser}>Envoyer</Button>

<style>
    .input-layout {
        width: 50%;
        margin-bottom: 15px;
    }
</style>
