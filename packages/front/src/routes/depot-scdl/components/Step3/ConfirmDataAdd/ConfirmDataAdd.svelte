<script lang="ts">
    import ConfirmDataAddController from "./ConfirmDataAdd.controller";
    import Alert from "$lib/dsfr/Alert.svelte";
    import Checkbox from "$lib/dsfr/Checkbox.svelte";
    import Table from "$lib/dsfr/Table.svelte";
    import TableRow from "$lib/dsfr/TableRow.svelte";
    interface Props {
        children?: import("svelte").Snippet;
        onprevStep?: () => void;
        onsubmitDatas?: () => void;
    }

    let { children, onprevStep = () => {}, onsubmitDatas = () => {} }: Props = $props();

    const headerLabels = ["Exercice", "Lignes actuellement en base", "Lignes traitées dans votre fichier"];
    const tableId = "grant-by-exercice-table";

    const checkboxOptions = [
        {
            label: "Je confirme que mes données sont complètes et à jour et j’accepte que les anciennes données soient effacées et remplacées par ce nouveau jeu.",
            value: "complete",
            withHtml: true,
        },
    ];
    let selectedValues: string[] = $state([]);

    const ctrl = new ConfirmDataAddController();
    const {
        addedLines,
        existingLinesInDb,
        rangeStartYear,
        rangeEndYear,
        filename,
        allocatorSiret,
        allocatorName,
        tableContent,
    } = ctrl;
</script>

<div class="fr-col-12 fr-col-md-8">
    {#if existingLinesInDb > 0}
        <Alert
            type="info"
            title="Vous êtes sur le point d’ajouter {addedLines} lignes et de mettre à jour dans Data.Subvention les données associées à votre structure.">
        </Alert>
    {:else}
        <Alert type="info" title="Vous êtes sur le point d’ajouter {addedLines} lignes." />
    {/if}

    <p>
        <span class="fr-text--bold">SIRET de l’attribuant indiqué :</span>
        <br />
        {allocatorSiret}
        {#if allocatorName}
            - {allocatorName}{/if}
    </p>

    <strong>Fichier ajouté :</strong>
    <br />
    <a
        class="fr-link fr-link--download"
        href="/packages/front/static"
        onclick={event => {
            event.preventDefault();
            ctrl.generateDownloadUrl();
        }}>
        {filename}
    </a>

    <p>
        <strong>
            Votre fichier comprend des données entre : l'exercice {rangeStartYear} et l'exercice {rangeEndYear}
        </strong>
    </p>

    {#if tableContent.length > 0}
        <div class="table-wrap">
            <Table id={tableId} size="sm" bordered={false} title="Comparaison des données :" titleClass="fr-text-lg">
                {#snippet headers()}
                    {#if children}{@render children()}{:else}
                        {#each headerLabels as header (header)}
                            <th>{header}</th>
                        {/each}
                    {/if}
                {/snippet}
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

    <a
        class="fr-link fr-link--download"
        href="/packages/front/static"
        onclick={event => {
            event.preventDefault();
            ctrl.downloadGrantsCsv();
        }}>
        Télécharger les données existantes
    </a>

    <div>
        {#if existingLinesInDb > 0}
            <p class="italic fr-mb-0">
                <strong>Origine des données actuellement présentes :</strong>
                <br />
                (a) d’un fichier SCDL déposé précédemment pour cette même structure via le parcours de dépôt.
                <br />
                (b) d’un jeu de données open data récupéré par data.subvention.
                <br />
                Aucune donnée issue d’un outil tiers ne sera remplacée.
            </p>
        {/if}
    </div>

    <div class="fr-mt-4v">
        <h6 class="fr-mb-0">A savoir :</h6>
        <ul>
            <li>Vos imports n’impactent que les exercices que vous transmettez.</li>
            <li>Les données des exercices non inclus dans votre fichier sont conservées.</li>
            <li>
                Pour un même exercice, les données existantes sont remplacées uniquement si l’import contient davantage
                de lignes que celles déjà présentes en production.
            </li>
        </ul>
    </div>

    <div class="fr-my-4v">
        <Checkbox options={checkboxOptions} bind:value={selectedValues} />
    </div>

    <div class="fr-mt-4v">
        <button onclick={onprevStep} class="fr-btn fr-btn--secondary fr-mr-3v" type="button">Retour</button>

        <button
            onclick={onsubmitDatas}
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

    .table-wrap {
        width: fit-content;
        max-width: 100%;
    }
</style>
