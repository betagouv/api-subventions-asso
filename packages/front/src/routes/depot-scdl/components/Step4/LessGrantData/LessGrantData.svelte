<script lang="ts">
    import Alert from "$lib/dsfr/Alert.svelte";
    import LessGrantDataController from "./LessGrantData.controller";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher<{ prevStep: void }>();
    const ctrl = new LessGrantDataController();
    const { rangeStartYear, rangeEndYear, detectedLines, existingLinesInDb, filename } = ctrl;
</script>

<div class="fr-col-12 fr-col-md-8">
    <Alert type="error" title="Votre fichier contient moins de lignes de données que ce que nous avons en base.">
        <p>Compte tenu de ces erreurs votre fichier n’est pas pris en compte.</p>
    </Alert>

    <p>
        <strong>Fichier ajouté :</strong>
        <br />
        <a class="fr-link fr-link--download" href="#" on:click|preventDefault={() => ctrl.generateDownloadUrl()}>
            {filename}
        </a>
    </p>

    <p>
        <strong>Votre fichier comprend des données entre : janvier {rangeStartYear} et décembre {rangeEndYear}</strong>
        <br />
        Ces dates sont données à titre indicatif. Elles ne garantissent pas que l’année soit complète.
    </p>

    <p>
        <strong>
            Nombre de lignes détectées : <span class="underlined-score">{detectedLines}</span>
        </strong>
        <br />
        <strong>Nombre de lignes déjà existantes dans notre base : {existingLinesInDb}</strong>
        <br />
        <a class="fr-link fr-link--download" href="#" on:click|preventDefault={() => ctrl.downloadGrantsCsv()}>
            Télécharger les données existantes
        </a>
    </p>

    <div class="fr-mt-4v">
        <button on:click={() => dispatch("prevStep")} class="fr-btn fr-btn--secondary fr-mr-3v" type="button">
            Retour
        </button>

        <button on:click={() => dispatch("prevStep")} class="fr-btn fr-mr-3v" type="button">
            Réimporter mon fichier
        </button>
    </div>
</div>

<style>
    .underlined-score {
        color: var(--red-marianne-425-625);
    }
</style>
