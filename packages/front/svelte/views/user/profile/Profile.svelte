<script>
    import { ProfileController } from "./Profile.controller";
    import DeleteUser from "./components/DeleteUser.svelte";
    import Button from "@dsfr/Button.svelte";
    import Alert from "@dsfr/Alert.svelte";

    const controller = new ProfileController();
    const { error } = controller;
</script>

<div class="fr-container">
    <div class="fr-grid-row">
        <div class="fr-col-8">
            {#if $error}
                <Alert title="La suppression a échouée, veuillez réessayer plus tard ou nous contacter." />
            {/if}
            <DeleteUser on:delete-user={() => controller.deleteUser()} />
        </div>
    </div>
    <div class="fr-grid-row fr-mt-8v">
        <div class="fr-col-3">
            <Button type="secondary" on:click={() => controller.logout}>Se déconnecter</Button>
        </div>
    </div>
</div>
