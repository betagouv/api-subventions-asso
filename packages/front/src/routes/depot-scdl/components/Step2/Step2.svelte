<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import StepIndicator from "$lib/components/StepIndicator/StepIndicator.svelte";
    import InfoBox from "$lib/components/InfoBox.svelte";
    import { isSiret } from "$lib/helpers/identifierHelper";
    import { depositLogStore } from "$lib/store/depositLog.store";
    import Step2Controller from "./Step2.controller";

    const ctrl = new Step2Controller();

    const dispatch = createEventDispatcher<{ nextStep: void; prevStep: void; resumeForm: void }>();

    export let currentStep: number;
    export let stepsDesc: string[];

    let inputValue = "";
    let touched = false;
    const infoBoxTitle = "💡 Vous ne connaissez pas le SIRET de l’attribuant ?";

    $: isValid = inputValue && isSiret(inputValue);
    $: hasError = touched && inputValue && !isValid;
    $: inputStatus = touched ? (hasError ? "error" : isValid ? "valid" : "") : "";
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

<div class="fr-col-12 fr-col-lg-11">
    <div class="fr-mb-6v">
        <StepIndicator {currentStep} {stepsDesc}></StepIndicator>
    </div>

    <div class="fr-input-group {inputStatus ? `fr-input-group--${inputStatus}` : ''} fr-mb-6v" id="input-group">
        <label class="fr-label" for="text-input">
            Indiquez le SIRET de l’attribuant :
            <span class="fr-hint-text">
                La collectivité ou l’organisme qui attribue les subventions dans ce fichier.
            </span>
        </label>
        <input
            bind:value={inputValue}
            on:blur={() => (touched = true)}
            class="fr-input"
            aria-describedby="input-messages"
            id="text-input"
            type="text" />
        <div class="fr-messages-group" id="input-messages" aria-live="polite">
            {#if hasError}
                <p class="fr-message fr-message--error" id="input-message-error">Le SIRET doit contenir 14 chiffres</p>
            {/if}
        </div>
    </div>

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

    <div>
        <button on:click={() => dispatch("prevStep")} class="fr-btn fr-btn--secondary fr-mr-3v" type="button">
            Retour
        </button>

        <button on:click={() => handleValidate(inputValue)} disabled={isDisabled} class="fr-btn fr-mr-3v" type="button">
            Valider
        </button>
    </div>
</div>
