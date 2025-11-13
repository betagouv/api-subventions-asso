<script lang="ts">
    import StepIndicator from "$lib/dsfr/StepIndicator/StepIndicator.svelte";
    import Step4Controller from "./Step4.controller";
    import InfoBox from "$lib/components/InfoBox.svelte";
    import MultipleAllocators from "./MultipleAllocators/MultipleAllocators.svelte";
    import LessGrantData from "./LessGrantData/LessGrantData.svelte";
    import { createEventDispatcher } from "svelte";
    import BlockingErrors from "./BlockingErrors/BlockingErrors.svelte";
    import ConfirmDataAdd from "./ConfirmDataAdd/ConfirmDataAdd.svelte";

    const dispatch = createEventDispatcher<{
        prevStep: void;
        nextStep: void;
        loading: void;
        endLoading: void;
        error: string;
        restartNewForm: void;
    }>();
    const ctrl = new Step4Controller(dispatch);
    const { view } = ctrl;

    export let currentStep: number;
    export let stepsDesc: string[];
</script>

<div>
    <div class="fr-mb-6v">
        <StepIndicator {currentStep} {stepsDesc}></StepIndicator>
    </div>

    <div class="fr-grid-row fr-grid-row--gutters">
        {#if $view === "multipleAllocator"}
            <MultipleAllocators
                on:prevStep={() => ctrl.handlePrevStep()}
                on:restartNewForm={() => ctrl.handleRestartNewForm()} />
        {:else if $view === "lessGrantData"}
            <LessGrantData on:prevStep={() => ctrl.handlePrevStep()} />
        {:else if $view === "blockingErrors"}
            <BlockingErrors on:prevStep={() => ctrl.handlePrevStep()} />
        {:else if $view === "confirmDataAdd"}
            <ConfirmDataAdd on:prevStep={() => ctrl.handlePrevStep()} on:submitDatas={() => ctrl.submitDatas()} />
        {/if}

        <div class="fr-col-12 fr-col-md-4">
            <InfoBox title="Besoin d’aide ?">
                <p>
                    Vous pouvez vous reporter à notre documentation pour plus d’informations.
                    <br />
                    <a
                        class="fr-link"
                        href="https://www.notion.so/R-gles-de-format-SCDL-1281788663a380e1a57efdd9b324c1ba">
                        Voir la documentation
                    </a>
                    <br />
                </p>
                <p class="fr-mb-4v">
                    Vous pouvez également nous contacter via le support Crisp ou prendre rendez-vous avec notre équipe.
                    Nous vous guiderons dans la mise à jour de votre fichier.
                    <br />
                    <a class="fr-link" href="mailto:{ctrl.contactEmail}">Prendre rendez-vous</a>
                </p>
            </InfoBox>
        </div>
    </div>
</div>
