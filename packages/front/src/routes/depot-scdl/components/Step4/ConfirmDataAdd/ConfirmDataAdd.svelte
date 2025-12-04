<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import ConfirmDataAddController from "./ConfirmDataAdd.controller";
    import Alert from "$lib/dsfr/Alert.svelte";
    import Checkbox from "$lib/dsfr/Checkbox.svelte";

    const dispatch = createEventDispatcher<{ prevStep: void; submitDatas: void }>();

    const checkboxOptions = [
        {
            label: "Je confirme que mes données sont complètes et à jour et j’accepte que les anciennes données soient effacées et remplacées par ce nouveau jeu. <strong>Cette opération est irréversible.</strong>",
            value: "complete",
            withHtml: true,
        },
    ];
    let selectedValues: string[] = [];

    const ctrl = new ConfirmDataAddController();
    const { addedLines, existingLinesInDb, rangeStartYear, rangeEndYear, filename } = ctrl;
</script>

<div class="fr-col-12 fr-col-md-8">
    {#if existingLinesInDb > 0}
        <Alert
            title="Vous êtes sur le point d’ajouter {addedLines} lignes et d’écraser les lignes déjà existantes dans notre base.">
            <p>
                Les données présentes actuellement dans notre base seront entièrement remplacées par celles contenues
                dans le fichier que vous venez de déposer.
            </p>
        </Alert>
    {:else}
        <Alert type="info" title="Vous êtes sur le point d’ajouter {addedLines} lignes." />
    {/if}

    <strong>Fichier ajouté :</strong>
    <br />
    <a class="fr-link fr-link--download" href="#" on:click|preventDefault={() => ctrl.generateDownloadUrl()}>
        {filename}
    </a>

    <p>
        <strong>Votre fichier comprend des données entre : janvier {rangeStartYear} et décembre {rangeEndYear}</strong>
        <br />
        Ces dates sont données à titre indicatif. Elles ne garantissent pas que l’année soit complète.
    </p>

    <p>
        <strong>Nombre de lignes traitées : {addedLines}</strong>
    </p>

    <div>
        <strong>Nombre de lignes existantes dans la base : {existingLinesInDb}</strong>
        <br />

        {#if existingLinesInDb > 0}
            <p class="italic fr-mb-0">
                Ces données proviennent :
                <br />
                (a) d’un fichier SCDL déposé précédemment pour cette même structure via le parcours de dépôt.
                <br />
                (b) d’un jeu de données open data récupéré par data.subvention.
                <br />
                Aucune donnée issue d’un outil tiers ne sera remplacée.
            </p>

            <a class="fr-link fr-link--download" href="#" on:click|preventDefault={() => ctrl.downloadGrantsCsv()}>
                Télécharger les données existantes
            </a>
        {/if}
    </div>

    <div class="fr-my-4v">
        <Checkbox options={checkboxOptions} bind:value={selectedValues} />
    </div>

    <div class="fr-mt-4v">
        <button on:click={() => dispatch("prevStep")} class="fr-btn fr-btn--secondary fr-mr-3v" type="button">
            Retour
        </button>

        <button
            on:click={() => dispatch("submitDatas")}
            class="fr-btn fr-mr-3v"
            type="button"
            disabled={!selectedValues.includes(checkboxOptions[0].value)}>
            Déposer mes données
        </button>
    </div>
</div>

<style>
    .italic {
        font-style: italic;
    }
</style>
