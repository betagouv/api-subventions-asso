<script>
    import { ProfileController } from "./Profile.controller";
    import DeleteUser from "$lib/components/DeleteUser.svelte";
    import Button from "$lib/dsfr/Button.svelte";
    import Alert from "$lib/dsfr/Alert.svelte";

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
</div>
