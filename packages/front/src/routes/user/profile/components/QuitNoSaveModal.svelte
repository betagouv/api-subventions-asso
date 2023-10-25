<script>
    import { action } from "$lib/store/modal.store";

    import ModalContent from "$lib/dsfr/ModalContent.svelte";
    import ModalFooter from "$lib/dsfr/ModalFooter.svelte";
</script>

<ModalContent title="Souhaitez-vous quitter sans enregistrer ?">
    Vous avez des modifications non enregistrées.
</ModalContent>
<ModalFooter confirmLabel="Quitter la page" confirmAction={$action} />
