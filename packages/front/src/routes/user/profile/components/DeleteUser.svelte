<script>
    import { createEventDispatcher } from "svelte";

    import ConfirmDeleteUserModal from "./ConfirmDeleteUserModal.svelte";
    import { action, modal } from "$lib/store/modal.store";
    import Button from "$lib/dsfr/Button.svelte";

    const dispatch = createEventDispatcher();

    function openConfirmationModal() {
        modal.update(() => ConfirmDeleteUserModal);
        action.update(() => () => dispatch("delete-user"));
    }
</script>

<div class="bordered-frame">
    <p class="red">
        <span class="fr-icon-close-line" />
        Vous souhaitez supprimer votre compte ?
    </p>
    <p>La suppression de votre compte entraine une suppression de toutes vos données et historique de recherche.</p>
    <Button
        on:click={openConfirmationModal}
        type="tertiary"
        ariaControls="fr-modal"
        trackerName="profile.delete-user.remove-account">
        Supprimer mon compte
    </Button>
</div>

<style>
    p.red {
        color: var(--text-title-red-marianne);
    }
</style>
