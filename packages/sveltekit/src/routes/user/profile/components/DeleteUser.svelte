<script>
    import { createEventDispatcher } from "svelte";

    import { action, modal } from "$lib/store/modal.store";
    import ConfirmDeleteUserModal from "./ConfirmDeleteUserModal.svelte";
    import Button from "$lib/dsfr/Button.svelte";

    const dispatch = createEventDispatcher();

    function openConfirmationModal() {
        action.set(() => {
            dispatch("delete-user");
            action.set(null);
            modal.set(null);
        });

        modal.update(() => ConfirmDeleteUserModal);
    }
</script>

<div class="fr-p-8v">
    <p class="red">
        <span class="fr-icon-close-line" />
        Vous souhaitez supprimer votre compte ?
    </p>
    <p>La suppression de votre compte entraine une suppression de toutes vos données et historique de recherche.</p>
    <Button ariaControls="fr-modal" on:click={openConfirmationModal} type="tertiary">Supprimer mon compte</Button>
</div>

<style>
    p.red {
        color: var(--text-title-red-marianne);
    }

    div {
        border: 1px solid var(--border-default-grey);
    }
</style>
