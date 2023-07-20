<script>
    import Button from "./Button.svelte";

    export let confirmLabel = "Confirmer";
    export let confirmAction = console.warn("You must define a confirm action");
    export let disableConfirm = false;
</script>

<div class="fr-modal__footer">
    <slot>
        <ul
            class="fr-btns-group fr-btns-group--right fr-btns-group--inline-reverse fr-btns-group--inline-lg fr-btns-group--icon-left">
            <li>
                <Button ariaControls="fr-modal">Annuler</Button>
            </li>
            <li>
                <Button on:click={confirmAction} type="secondary" disabled={disableConfirm}>
                    {confirmLabel}
                </Button>
            </li>
        </ul>
    </slot>
</div>
