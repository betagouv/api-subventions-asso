<script lang="ts">
    import Alert from "$lib/dsfr/Alert.svelte";
    import LessGrantDataController from "./LessGrantData.controller";
    import { createEventDispatcher } from "svelte";
    import Table from "$lib/dsfr/Table.svelte";
    import TableRow from "$lib/dsfr/TableRow.svelte";

    const headers = ["Exercice", "Lignes actuellement en base", "Lignes traitées dans votre fichier"];
    const tableId = "grant-by-exercice-table";

    const dispatch = createEventDispatcher<{ prevStep: void }>();
    const ctrl = new LessGrantDataController();
    const {
        rangeStartYear,
        rangeEndYear,
        detectedLines,
        existingLinesInDb,
        filename,
        allocatorSiret,
        allocatorName,
        tableContent,
    } = ctrl;
</script>

<div class="fr-col-12 fr-col-md-8">
    <Alert type="error" title="Votre fichier contient moins de lignes de données que ce que nous avons en base.">
        <p>Compte tenu de ces erreurs votre fichier n’est pas pris en compte.</p>
    </Alert>

    <p>
        <span class="fr-text--bold">SIRET de l’attribuant indiqué :</span>
        <br />
        {allocatorSiret}
        {#if allocatorName}
            - {allocatorName}{/if}
    </p>

    <p class="fr-mb-0">
        <strong>Fichier ajouté :</strong>
        <br />
        <a
            class="fr-link fr-link--download"
            href="/packages/front/static"
            on:click|preventDefault={() => ctrl.generateDownloadUrl()}>
            {filename}
        </a>
    </p>

    <p>
        <strong>
            Votre fichier comprend des données entre : l'exercice {rangeStartYear} et l'exercice {rangeEndYear}
        </strong>
    </p>

    {#if tableContent.length > 0}
        <div class="table-wrap">
            <Table id={tableId} size="sm" bordered={false} title="Comparaison des données :" titleClass="fr-text-lg">
                <slot slot="headers">
                    {#each headers as header (header)}
                        <th>{header}</th>
                    {/each}
                </slot>
                {#each tableContent as exercice, index (index)}
                    <TableRow id={tableId} {index}>
                        <td class="primary">{exercice.exercice}</td>
                        <td>{exercice.linesInDb}</td>
                        <td>{exercice.parsedLines}</td>
                    </TableRow>
                {/each}
            </Table>
        </div>
    {/if}

    <p>
        <strong>
            Nombre de lignes détectées : <span class="underlined-score">{detectedLines}</span>
        </strong>
        <br />
        <strong>Nombre de lignes déjà existantes dans notre base : {existingLinesInDb}</strong>
        <br />
        <a
            class="fr-link fr-link--download"
            href="/packages/front/static"
            on:click|preventDefault={() => ctrl.downloadGrantsCsv()}>
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

    .table-wrap {
        width: fit-content;
        max-width: 100%;
    }
</style>
