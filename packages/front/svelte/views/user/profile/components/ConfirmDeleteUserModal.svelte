<script>
    import { action } from "../../../../store/modal.store";

    import Alert from "../../../../dsfr/Alert.svelte";
    import ModalContent from "../../../../dsfr/ModalContent.svelte";
    import ModalFooter from "../../../../dsfr/ModalFooter.svelte";

    const deleteUser = () => {
        action.value();
    };

    let temporyDisabled = true;

    setTimeout(() => (temporyDisabled = false), 1000);
</script>

<ModalContent title="Souhaitez-vous vraiment supprimer votre compte ?">
    <Alert>Cette action est définitive, pour réutiliser Data.Subvention, vous devrez créer un nouveau compte.</Alert>
</ModalContent>
<ModalFooter
    disableConfirm={temporyDisabled}
    confirmLabel="Je confirme la suppression de mon compte"
    confirmAction={deleteUser} />
