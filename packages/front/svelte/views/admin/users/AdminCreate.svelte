<script>
    import Button from "../../../dsfr/Button.svelte";
    import Input from "../../../dsfr/Input.svelte"

    import adminService from "../admin.service";

    let email;
</script>

<style>
    

    .input-layout {
        width: 50%;
        margin-bottom: 15px;
    }
</style>

<div class="fr-input-group">
    <div class="input-layout">
        <Input label="Email" bind:value={email} />
    </div>
    <p id="text-input-valid-desc-valid" class="fr-valid-text">
      Texte de validation
    </p>
</div>

<h2>Création d'un utilisateur</h2>
<Button on:click={() => adminService.create(email)}>Envoyer</Button>