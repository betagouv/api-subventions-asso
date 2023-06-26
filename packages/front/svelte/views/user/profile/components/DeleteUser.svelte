<script>
    import { createEventDispatcher } from "svelte";
    import Button from "@dsfr/Button.svelte";

    const dispatch = createEventDispatcher();

    function deleteUser() {
        dispatch("delete-user");
    }
</script>

<div class="fr-p-8v">
    <p class="red">
        <span class="fr-icon-close-line" />
        Vous souhaitez supprimer votre compte ?
    </p>
    <p>La suppression de votre compte entraine une suppression de toutes vos données et historique de recherche.</p>
    <Button on:click={deleteUser} type="tertiary">Supprimer mon compte</Button>
</div>

<style>
    p.red {
        color: var(--text-title-red-marianne);
    }

    div {
        border: 1px solid var(--border-default-grey);
    }
</style>
