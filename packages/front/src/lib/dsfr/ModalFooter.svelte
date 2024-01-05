<script>
    import Button from "./Button.svelte";

    export let confirmLabel = "Confirmer";
    export let confirmAction = console.warn("You must define a confirm action");
    export let disableConfirm = false;
</script>

<div class="fr-modal__footer">
    <slot>
        <div
            class="fr-btns-group fr-btns-group--right fr-btns-group--inline-reverse fr-btns-group--inline-lg fr-btns-group--icon-left">
            <Button ariaControls="fr-modal" type="secondary">Annuler</Button>
            <Button on:click={confirmAction} ariaControls="fr-modal" disabled={disableConfirm}>
                {confirmLabel}
            </Button>
        </div>
    </slot>
</div>
