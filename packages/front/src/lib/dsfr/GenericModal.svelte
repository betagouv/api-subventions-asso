<script>
    import Button from "./Button.svelte";
    import { modal } from "$lib/store/modal.store";
</script>

<dialog aria-labelledby="fr-modal-title" id="fr-modal" class="fr-modal">
    <div class="fr-container fr-container--fluid fr-container-md">
        <div class="fr-grid-row fr-grid-row--center">
            <div class="fr-col-12 fr-col-md-8 fr-col-lg-8">
                <div class="fr-modal__body">
                    <div class="fr-modal__header">
                        <Button
                            iconPosition="right"
                            icon="close-line"
                            ariaControls="fr-modal"
                            type="tertiary"
                            outline={false}
                            trackerName="modals.close"
                            title="Fermer la fenêtre modale">
                            Fermer
                        </Button>
                    </div>
                    <div class="child-modal">
                        <svelte:component this={$modal} />
                    </div>
                </div>
            </div>
        </div>
    </div>
</dialog>

<style>
    .fr-modal__header {
        display: flex;
        justify-content: flex-end;
    }

    .fr-modal__body {
        display: flex;
        flex-direction: column;
        overflow: hidden;
        padding: 32px 36px;
    }

    .child-modal {
        overflow-x: auto;
    }
</style>
