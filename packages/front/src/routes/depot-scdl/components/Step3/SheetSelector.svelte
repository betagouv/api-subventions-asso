<script lang="ts">
    import Alert from "$lib/dsfr/Alert.svelte";
    import Radio from "$lib/dsfr/Radio.svelte";
    import Callout from "$lib/dsfr/Callout.svelte";
    import { createEventDispatcher } from "svelte";
    import SheetSelectorController from "./SheetSelector.controller";

    export let excelSheets: string[];

    const ctrl = new SheetSelectorController(excelSheets);
    const { selectedOption, radioObj } = ctrl;

    const dispatch = createEventDispatcher<{ sheetSelected: string; restartUpload: void }>();
</script>

<div>
    <div class="fr-mb-6v">
        <Alert type="info" title="Votre fichier contient plusieurs feuilles" />

        <Radio bind:value={$selectedOption} on:change={e => ctrl.handleChange(e)} {...radioObj}></Radio>

        <Callout title="Pourquoi cette étape est importante ?" icon="fr-icon-info-line">
            <p>
                Nous ne traitons qu’une seule feuille par fichier. Pour garantir un traitement automatisé et éviter les
                erreurs, nous vous demandons de rassembler l’ensemble des données pertinentes dans un seul onglet.
            </p>
        </Callout>

        <div>
            <button on:click={() => dispatch("restartUpload")} class="fr-btn fr-btn--secondary fr-mr-3v" type="button">
                Retour
            </button>

            <button
                on:click={() => dispatch("sheetSelected", $selectedOption)}
                disabled={$selectedOption === ""}
                class="fr-btn fr-mr-3v"
                type="button">
                Confirmer l'onglet sélectionné
            </button>
        </div>
    </div>
</div>
