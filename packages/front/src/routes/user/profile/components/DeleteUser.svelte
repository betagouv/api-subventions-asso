<script lang="ts">
    import ConfirmDeleteUserModal from "./ConfirmDeleteUserModal.svelte";
    import { action, modal } from "$lib/store/modal.store";
    import Button from "$lib/dsfr/Button.svelte";

    let { onDeleteUser = () => {} } = $props();

    function openConfirmationModal() {
        modal.update(() => ConfirmDeleteUserModal);
        action.update(() => onDeleteUser);
    }
</script>

<div class="bordered-frame">
    <p class="red">
        <span class="fr-icon-close-line"></span>
        Vous souhaitez supprimer votre compte ?
    </p>
    <p>La suppression de votre compte entraine une suppression de toutes vos données et historique de recherche.</p>
    <Button
        onclick={openConfirmationModal}
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
