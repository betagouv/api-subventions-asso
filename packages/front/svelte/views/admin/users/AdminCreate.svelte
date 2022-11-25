<script>
import Alert from "../../../dsfr/Alert.svelte";
import Button from "../../../dsfr/Button.svelte";
    import Input from "../../../dsfr/Input.svelte"

    import adminService from "../admin.service";

    let email;
    let error = false;

    const createUser = () => { 
        error = false;
        adminService.create(email).catch(() => error = true)
    };

</script>

<style>
    .input-layout {
        width: 50%;
        margin-bottom: 15px;
    }
</style>

{#if error}
    <Alert title="L'adresse n'est pas valide ou est déjà liée à un compte utilisateur" />
{/if}

<h2>Création d'un utilisateur</h2>
<div class="input-layout">
    <Input label="Email" bind:value={email} />
</div>
<Button on:click={createUser}>Envoyer</Button>