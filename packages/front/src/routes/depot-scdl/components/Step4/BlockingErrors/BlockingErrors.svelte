<script lang="ts">
    import Alert from "$lib/dsfr/Alert.svelte";
    import { createEventDispatcher } from "svelte";
    import BlockingErrorsController from "./BlockingErrors.controller";

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
