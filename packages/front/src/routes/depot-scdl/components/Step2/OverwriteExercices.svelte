<script lang="ts">
    import Alert from "$lib/dsfr/Alert.svelte";
    import OverwriteExercicesController from "./OverwriteExercices.controller";
    import Table from "$lib/dsfr/Table.svelte";
    import TableRow from "$lib/dsfr/TableRow.svelte";
    import NeedHelpInfoBox from "../NeedHelpInfoBox.svelte";
    interface Props {
        children?: import("svelte").Snippet;
        ontoFileSelect?: () => void;
        onvalidate?: (detail: { checkedExercises: number[] }) => void;
    }

    let { children, ontoFileSelect = () => {}, onvalidate = () => {} }: Props = $props();

    const headerLabels = ["Exercice", "Lignes actuellement en base", "Lignes traitées dans votre fichier"];
    const tableId = "grant-by-exercice-table";

    const ctrl = new OverwriteExercicesController();
    const { allocatorSiret, allocatorName, filename, tableContent, checkedExercices } = ctrl;
</script>

<div class="fr-grid-row fr-grid-row--gutters">
    <div class="fr-col-12 fr-col-md-8">
        <Alert type="info" title="Nous avons détecté des données déjà présentes dans notre base.">
            Vous pouvez les sélectionner si vous souhaitez les mettre à jour. Les années non présentes dans la base sont
            cochées par défaut.
        </Alert>

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

        {#if tableContent.length > 0}
            <div class="table-wrap">
                <Table
                    id={tableId}
                    size="sm"
                    bordered={false}
                    title="Sélectionnez les années que vous souhaitez importer :"
                    titleClass="fr-h6">
                    {#snippet headers()}
                        {#if children}{@render children()}{:else}
                            <th class="fr-cell--fixed" role="columnheader">
                                <span class="fr-sr-only">Sélectionner</span>
                            </th>
                            {#each headerLabels as header (header)}
                                <th>{header}</th>
                            {/each}
                        {/if}
                    {/snippet}
                    {#each tableContent as exercice, index (index)}
                        <TableRow id={tableId} {index} selected={$checkedExercices.includes(exercice.exercice)}>
                            <th class="fr-cell--fixed" scope="row">
                                <div class="fr-checkbox-group fr-checkbox-group--sm">
                                    <input
                                        name="row-select"
                                        id="table-select-checkbox--{index}"
                                        type="checkbox"
                                        checked={$checkedExercices.includes(exercice.exercice)}
                                        onchange={() => ctrl.toggleOne(exercice.exercice)} />
                                    <label class="fr-label" for="table-select-checkbox--{index}">
                                        Sélectionner {exercice.exercice}
                                    </label>
                                </div>
                            </th>
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
            <p class="italic fr-mb-0">
                <strong>Origine des données actuellement présentes :</strong>
                <br />
                (a) d’un fichier SCDL déposé précédemment pour cette même structure via le parcours de dépôt.
                <br />
                (b) d’un jeu de données open data récupéré par data.subvention.
                <br />
                Aucune donnée issue d’un outil tiers ne sera remplacée.
            </p>
        </div>

        <div class="fr-mt-4v">
            <button onclick={ontoFileSelect} class="fr-btn fr-btn--secondary fr-mr-3v" type="button">Retour</button>

            <button
                onclick={() => onvalidate({ checkedExercises: [...$checkedExercices] })}
                disabled={$checkedExercices.length === 0}
                class="fr-btn fr-mr-3v"
                type="button">
                Confirmer la sélection
            </button>
        </div>
    </div>

    <div class="fr-col-12 fr-col-md-4">
        <NeedHelpInfoBox />
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
