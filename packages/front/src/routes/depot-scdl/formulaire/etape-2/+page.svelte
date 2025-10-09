<script>
    import StepTwoController from "./StepTwoController";

    const controller = new StepTwoController();

    let inputValue = "";
    let touched = false;

    $: isValid = inputValue && controller.isCorrectSiret(inputValue);
    $: hasError = touched && inputValue && !isValid;
    $: inputStatus = touched ? (hasError ? "error" : isValid ? "valid" : "") : "";

    const handleBlur = () => {
        touched = true;
    };
</script>

<div class="fr-input-group {inputStatus ? `fr-input-group--${inputStatus}` : ''} fr-mb-6v" id="input-group">
    <label class="fr-label" for="text-input">
        Indiquez le SIRET de l’attribuant :
        <span class="fr-hint-text">La collectivité ou l’organisme qui attribue les subventions dans ce fichier.</span>
    </label>
    <input
        bind:value={inputValue}
        on:blur={handleBlur}
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

<div class="dsfr-doc-edit background-custom-alt-blue-france fr-p-8v fr-mb-6v">
    <p class="fr-text--lg fr-text--bold">💡 Vous ne connaissez pas le SIRET de l’attribuant ?</p>

    <div class="dsfr-doc-edit__description">
        <p class="fr-mb-4v">Vous pouvez :</p>
        <ul>
            <li>regarder dans votre fichier Excel s'il y figure</li>
            <li>
                le rechercher sur
                <a class="fr-link" href="https://annuaire-entreprises.data.gouv.fr/">Annuaire Entreprises →</a>
            </li>
        </ul>
    </div>
</div>

<div>
    <button on:click={controller.goToStep1} class="fr-btn fr-btn--secondary fr-mr-3v" type="button">Retour</button>

    <button
        on:click={() => controller.onValidate(inputValue)}
        disabled={!inputValue}
        class="fr-btn fr-mr-3v"
        type="button">
        Valider
    </button>
</div>

<style>
    .background-custom-alt-blue-france {
        background-color: var(--background-alt-blue-france);
    }
</style>
