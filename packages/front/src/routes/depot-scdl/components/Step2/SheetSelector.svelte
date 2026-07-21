<script lang="ts">
    import Alert from "$lib/dsfr/Alert.svelte";
    import Radio from "$lib/dsfr/Radio.svelte";
    import Callout from "$lib/dsfr/Callout.svelte";
    import SheetSelectorController from "./SheetSelector.controller";

    interface Props {
        excelSheets: string[];
        onsheetSelected?: (sheet: string) => void;
        onrestartUpload?: () => void;
    }

    let { excelSheets, onsheetSelected = () => {}, onrestartUpload = () => {} }: Props = $props();

    const ctrl = new SheetSelectorController(excelSheets);
    const { selectedOption, radioObj } = ctrl;
</script>

<div>
    <div class="fr-mb-6v">
        <Alert type="info" title="Votre fichier contient plusieurs feuilles" />

        <Radio
            bind:value={$selectedOption}
            onchange={detail => ctrl.handleChange({ detail } as CustomEvent)}
            {...radioObj}></Radio>

        <Callout title="Pourquoi cette étape est importante ?" icon="fr-icon-info-line">
            <p>
                Nous ne traitons qu’une seule feuille par fichier. Pour garantir un traitement automatisé et éviter les
                erreurs, nous vous demandons de rassembler l’ensemble des données pertinentes dans un seul onglet.
            </p>
        </Callout>

        <div>
            <button onclick={onrestartUpload} class="fr-btn fr-btn--secondary fr-mr-3v" type="button">Retour</button>

            <button
                onclick={() => onsheetSelected($selectedOption)}
                disabled={$selectedOption === ""}
                class="fr-btn fr-mr-3v"
                type="button">
                Confirmer l'onglet sélectionné
            </button>
        </div>
    </div>
</div>
