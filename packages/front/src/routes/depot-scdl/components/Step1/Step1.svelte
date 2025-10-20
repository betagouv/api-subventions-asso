<script lang="ts">
    import StepIndicator from "$lib/dsfr/StepIndicator/StepIndicator.svelte";
    import Checkbox from "$lib/dsfr/Checkbox.svelte";
    import Alert from "$lib/dsfr/Alert.svelte";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher<{ nextStep: void; prevStep: void }>();

    export let currentStep: number;
    export let stepsDesc: string[];

    const checkboxOptions = [
        {
            label: "Je certifie que mon fichier contient l'ensemble des années à jour et j’ai conscience que les données précédemment présentes seront écrasées si non incluses dans mon fichier. Cette déclaration prendra effet lorsque vous validerez définitivement le dépôt du fichier.",
            value: "overwrite",
        },
    ];
    let selectedValues: string[] = [];
</script>

<div class="fr-col-12 fr-col-lg-11">
    <div class="fr-mb-6v">
        <StepIndicator {currentStep} {stepsDesc}></StepIndicator>
    </div>

    <div class="fr-mb-6v">
        <Alert type="warning" title="Alerte sur l’écrasement des données">
            Pour garantir la qualité et l'exhaustivité des données, nous vous demandons de <strong>
                déposer un fichier unique contenant l’ensemble des années disponibles dans votre périmètre, y compris
                les données déjà transmises si elles doivent être maintenues.
            </strong>
            Toute nouvelle importation remplace les données déjà présentes pour votre structure.
            <br />
            Si vous ne renseignez pas à nouveau des données déjà transmises, elles seront supprimées de la base.
        </Alert>
    </div>

    <div class="fr-text fr-mb-2v">
        <p class="fr-text--bold fr-text--lead fr-mb-0">Pourquoi c'est important ?</p>
        <ul>
            <li>Cela permet à tous les agents publics d’avoir une vision complète et fiable des données.</li>
            <li>Cela garantit que les données visibles dans Data.Subvention soient toujours à jour.</li>
            <li>Cela évite les doublons, les incohérences ou les erreurs de traitement en aval.</li>
        </ul>
    </div>

    <div class="fr-mb-6v">
        <Checkbox options={checkboxOptions} label="" bind:value={selectedValues} />
    </div>
    <div>
        <button on:click={() => dispatch("prevStep")} class="fr-btn fr-btn--secondary fr-mr-3v" type="button">
            Retour
        </button>

        <button
            on:click={() => dispatch("nextStep")}
            disabled={!selectedValues.includes(checkboxOptions[0].value)}
            class="fr-btn fr-mr-3v"
            type="button">
            Poursuivre l'import
        </button>
    </div>
</div>
