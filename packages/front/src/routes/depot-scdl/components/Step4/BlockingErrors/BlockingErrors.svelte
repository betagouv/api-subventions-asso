<script lang="ts">
    import Alert from "$lib/dsfr/Alert.svelte";
    import { createEventDispatcher } from "svelte";
    import BlockingErrorsController from "./BlockingErrors.controller";
    import TargetBlankLink from "$lib/components/TargetBlankLink.svelte";
    import InfoBox from "$lib/components/InfoBox.svelte";

    const dispatch = createEventDispatcher<{ prevStep: void }>();
    const ctrl = new BlockingErrorsController();
</script>

<div class="fr-col-12 fr-col-md-8">
    <Alert type="error" title="Votre fichier contient des erreurs">
        <p>
            Nous avons détecté des incohérences ou des éléments manquants dans votre fichier. Il ne peut pas être
            intégré en l’état. Compte tenu de ces erreurs votre fichier n’est pas pris en compte.
        </p>
    </Alert>

    {#if ctrl.isErrorReportTruncated}
        <Alert type="warning" title="Le rapport d'erreur est trop long">
            <p>
                Le fichier SCDL contient {ctrl.errorCount} erreurs. Le rapport d'erreur à été tronqué aux 1000 premières lignes.
            </p>
        </Alert>

        <InfoBox>
            <div class="fr-mb-2v">
                Avant de réimporter votre fichier, nous vous conseillons de consulter notre documentation pour vérifier
                que votre fichier respecte ce format.
            </div>
            <TargetBlankLink href="https://www.notion.so/R-gles-de-format-SCDL-1281788663a380e1a57efdd9b324c1ba">
                Documentation SCDL
            </TargetBlankLink>
        </InfoBox>
    {/if}

    <a class="fr-link fr-link--download" href="/" on:click|preventDefault={() => ctrl.downloadErrorFile()}>
        Télécharger le rapport d'erreurs
    </a>

    <p>Ce fichier contient le détail des lignes concernées, les colonnes en erreur, et les corrections attendues.</p>

    <div class="fr-mt-4v">
        <button on:click={() => dispatch("prevStep")} class="fr-btn fr-btn--secondary fr-mr-3v" type="button">
            Retour
        </button>

        <button on:click={() => dispatch("prevStep")} class="fr-btn fr-mr-3v" type="button">
            Réimporter mon fichier
        </button>
    </div>
</div>
