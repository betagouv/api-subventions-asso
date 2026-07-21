<script lang="ts">
    import InfoBox from "$lib/components/InfoBox.svelte";
    import Step1Controller from "./Step1.controller";
    import Input from "$lib/dsfr/Input.svelte";
    import TargetBlankLink from "$lib/components/TargetBlankLink.svelte";

    let { onnextStep = () => {}, onprevStep = () => {}, onresumeForm = () => {} } = $props();

    const ctrl = new Step1Controller();
    const { inputValue, hasError, isDisabled } = ctrl;

    const infoBoxTitle = "💡 Vous ne connaissez pas le SIRET de l’attribuant ?";

    async function handleValidate() {
        const result = await ctrl.handleValidate();
        if (result === "success") {
            onnextStep();
        } else if (result === "resume") {
            onresumeForm();
        }
    }
</script>

<div>
    <Input
        id="siret"
        name="siret"
        type="text"
        bind:value={$inputValue}
        label="Indiquez le SIRET de l’attribuant :"
        hint="La collectivité ou l’organisme qui attribue les subventions dans ce fichier."
        onchange
        onblur={() => ctrl.setTouch(true)}
        error={$hasError ? "true" : ""}
        errorMsg="Le SIRET doit contenir 14 chiffres" />

    <div class="fr-mb-6v">
        <InfoBox title={infoBoxTitle}>
            <p class="fr-mb-4v">Vous pouvez :</p>
            <ul>
                <li>regarder dans votre fichier Excel s'il y figure</li>
                <li>
                    le rechercher sur
                    <TargetBlankLink href="https://annuaire-entreprises.data.gouv.fr/">
                        Annuaire Entreprises
                    </TargetBlankLink>
                </li>
            </ul>
        </InfoBox>
    </div>

    <div>
        <button onclick={onprevStep} class="fr-btn fr-btn--secondary fr-mr-3v" type="button">Retour</button>

        <button onclick={() => handleValidate()} disabled={$isDisabled} class="fr-btn fr-mr-3v" type="button">
            Valider
        </button>
    </div>
</div>
