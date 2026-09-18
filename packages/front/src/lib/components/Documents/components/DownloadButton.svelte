<script lang="ts">
    import Button from "$lib/dsfr/Button.svelte";
    import DownloadButtonController from "$lib/components/Documents/components/DownloadButton.controller";
    import type { ReadStore } from "$lib/core/Store";
    import type { DocumentEntity } from "$lib/entities/DocumentEntity";

    interface Props {
        docsStore: ReadStore<DocumentEntity[]>;
        ondownload?: () => void;
        onreset?: () => void;
    }

    let { docsStore, ondownload = () => {}, onreset = () => {} }: Props = $props();

    const ctrl = new DownloadButtonController(docsStore);
    const { downloadBtnLabel, resetBtnDisabled } = ctrl;
</script>

<ul
    class="fr-btns-group fr-btns-group--inline-reverse fr-btns-group--inline-sm fr-btns-group--icon-right fr-btns-group--right">
    <li>
        <Button
            iconPosition="right"
            icon="download-line"
            trackerName="download-zip"
            title={$downloadBtnLabel}
            onclick={ondownload}>
            {$downloadBtnLabel}
        </Button>
    </li>
    <li>
        <Button
            type="tertiary"
            outline={false}
            disabled={$resetBtnDisabled}
            trackerName="reset-docs-selection"
            title="Réinitialiser la sélection de documents"
            onclick={onreset}>
            Tout désélectionner
        </Button>
    </li>
</ul>
