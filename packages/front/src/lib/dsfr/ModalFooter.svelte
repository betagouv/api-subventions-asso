<script lang="ts">
    import Button from "./Button.svelte";

    interface Props {
        confirmLabel?: string;
        confirmAction?: () => void;
        disableConfirm?: boolean;
        children?: import("svelte").Snippet;
    }

    let {
        confirmLabel = "Confirmer",
        confirmAction = console.warn("You must define a confirm action"),
        disableConfirm = false,
        children,
    }: Props = $props();
</script>

<div class="fr-modal__footer">
    {#if children}{@render children()}{:else}
        <div
            class="fr-btns-group fr-btns-group--right fr-btns-group--inline-reverse fr-btns-group--inline-lg fr-btns-group--icon-left">
            <Button ariaControls="fr-modal" type="secondary">Annuler</Button>
            <Button onclick={confirmAction} ariaControls="fr-modal" disabled={disableConfirm}>
                {confirmLabel}
            </Button>
        </div>
    {/if}
</div>
