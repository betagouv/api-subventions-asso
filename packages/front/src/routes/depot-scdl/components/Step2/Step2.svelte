<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import StepIndicator from "$lib/dsfr/StepIndicator/StepIndicator.svelte";
    import InfoBox from "$lib/components/InfoBox.svelte";
    import { isSiret } from "$lib/helpers/identifierHelper";
    import { depositLogStore } from "$lib/store/depositLog.store";
    import Step2Controller from "./Step2.controller";
    import Input from "$lib/dsfr/Input.svelte";

    const ctrl = new Step2Controller();

    const dispatch = createEventDispatcher<{ nextStep: void; prevStep: void; resumeForm: void }>();

    export let currentStep: number;
    export let stepsDesc: string[];

    let inputValue = "";
    let touched = false;
    const infoBoxTitle = "💡 Vous ne connaissez pas le SIRET de l’attribuant ?";

    $: isValid = inputValue && isSiret(inputValue);
    $: hasError = touched && inputValue && !isValid;
    $: isDisabled = Boolean(!inputValue || hasError);

    async function handleValidate(inputValue: string) {
        const sanitazedInput = inputValue.replace(/\s+/g, "");
        const result = await ctrl.handleValidate(sanitazedInput, $depositLogStore);

        if (result === "success") {
            dispatch("nextStep");
        } else if (result === "resume") {
            dispatch("resumeForm");
        }
    }
    // todo : add <form> dans template ?
</script>

<div>
    <div class="fr-mb-6v">
        <StepIndicator {currentStep} {stepsDesc}></StepIndicator>
    </div>

    <Input
        id="siret"
        name="siret"
        type="text"
        bind:value={inputValue}
        label="Indiquez le SIRET de l’attribuant :"
        hint="La collectivité ou l’organisme qui attribue les subventions dans ce fichier."
        on:change
        on:blur={() => (touched = true)}
        error={hasError ? "true" : ""}
        errorMsg="Le SIRET doit contenir 14 chiffres" />

    <div class="fr-mb-6v">
        <InfoBox title={infoBoxTitle}>
            <p class="fr-mb-4v">Vous pouvez :</p>
            <ul>
                <li>regarder dans votre fichier Excel s'il y figure</li>
                <li>
                    le rechercher sur
                    <a class="fr-link" href="https://annuaire-entreprises.data.gouv.fr/">Annuaire Entreprises →</a>
                </li>
            </ul>
        </InfoBox>
    </div>

    <div>
        <button on:click={() => dispatch("prevStep")} class="fr-btn fr-btn--secondary fr-mr-3v" type="button">
            Retour
        </button>

        <button on:click={() => handleValidate(inputValue)} disabled={isDisabled} class="fr-btn fr-mr-3v" type="button">
            Valider
        </button>
    </div>
</div>
