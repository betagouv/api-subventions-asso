<script lang="ts">
    import Button from "./Button.svelte";

    interface Props {
        confirmLabel?: string;
        confirmAction?: () => void;
        disableConfirm?: boolean;
        cancelTrackerName?: string;
        confirmTrackerName?: string;
        children?: import("svelte").Snippet;
    }

    let {
        confirmLabel = "Confirmer",
        confirmAction = () => console.warn("You must define a confirm action"),
        disableConfirm = false,
        cancelTrackerName = "",
        confirmTrackerName = "",
        children,
    }: Props = $props();
</script>

<div class="fr-modal__footer">
    {#if children}{@render children()}{:else}
        <div
            class="fr-btns-group fr-btns-group--right fr-btns-group--inline-reverse fr-btns-group--inline-lg fr-btns-group--icon-left">
            <Button
                ariaControls="fr-modal"
                type="secondary"
                trackerName={cancelTrackerName}
                trackingDisable={!cancelTrackerName}>
                Annuler
            </Button>
            <Button
                onclick={confirmAction}
                ariaControls="fr-modal"
                disabled={disableConfirm}
                trackerName={confirmTrackerName}
                trackingDisable={!confirmTrackerName}>
                {confirmLabel}
            </Button>
        </div>
    {/if}
</div>
