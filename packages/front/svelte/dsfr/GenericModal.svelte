<script>
    import Button from "./Button.svelte";
    import { modal } from "../store/modal.store";
</script>

<dialog aria-labelledby="fr-modal-title" id="fr-modal" class="fr-modal">
    <div class="fr-container fr-container--fluid fr-container-md">
        <div class="fr-grid-row fr-grid-row--center">
            <div class="fr-col-12 fr-col-md-8 fr-col-lg-8">
                <div class="fr-modal__body">
                    <div class="fr-modal__header flex-right">
                        <Button
                            iconPosition="right"
                            icon="close-line"
                            ariaControls="fr-modal"
                            type="tertiary"
                            outline={false}
                            title="Fermer la fenêtre modale">
                            Fermer
                        </Button>
                    </div>
                    <svelte:component this={$modal} />
                </div>
            </div>
        </div>
    </div>
</dialog>
