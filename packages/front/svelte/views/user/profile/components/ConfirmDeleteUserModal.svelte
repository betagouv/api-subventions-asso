<script>
    import { action } from "../../../../store/modal.store";

    import Alert from "../../../../dsfr/Alert.svelte";
    import Button from "../../../../dsfr/Button.svelte";
    import ModalContent from "../../../../dsfr/ModalContent.svelte";

    const deleteUser = () => {
        action.value();
    };

    let temporyDisabled = true;

    setTimeout(() => (temporyDisabled = false), 2000);
</script>

<ModalContent title="Souhaitez-vous vraiment supprimer votre compte ?">
    <div class="fr-container">
        <Alert>
            Cette action est définitive, pour réutiliser Data.Subvention, vous devrez créer un nouveau compte.
        </Alert>
        <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--center">
            <Button on:click={deleteUser} ariaControls="fr-modal" disabled={temporyDisabled} type="tertiary">
                Je comfirme la suppression de mon compte
            </Button>
            <Button styleClass="fr-col-offset-1" ariaControls="fr-modal">Annuler</Button>
        </div>
    </div>
</ModalContent>
