<script lang="ts">
    import WelcomeForm from "./components/WelcomeForm/WelcomeForm.svelte";
    import ResumeForm from "./components/ResumeForm/ResumeForm.svelte";
    import Step1 from "./components/Step1/Step1.svelte";
    import Step2 from "./components/Step2/Step2.svelte";
    import { onMount } from "svelte";
    import { DepositScdlController } from "./DepositScdl.controller";
    import Step3 from "./components/Step3/Step3.svelte";
    import Spinner from "$lib/components/Spinner.svelte";
    import Step4 from "./components/Step4/Step4.svelte";
    import Step5 from "./components/Step5/Step5.svelte";
    import StepIndicator from "$lib/dsfr/StepIndicator/StepIndicator.svelte";

    const stepComponents = { 1: Step1, 2: Step2, 3: Step3, 4: Step4, 5: Step5 };

    const ctrl = new DepositScdlController(stepComponents);
    const { currentStep, currentView, currentStepComponent, stepsDesc, currentLoadingMessage, isLoading } = ctrl;

    onMount(async () => {
        await ctrl.onMount();
    });
</script>

<main>
    <div class="fr-container">
        <div class="fr-grid-row fr-grid-row--center">
            {#if $currentView === "welcome"}
                <WelcomeForm on:start={() => ctrl.startNewForm()} />
            {:else if $currentView === "resume"}
                <ResumeForm on:resume={() => ctrl.resumeForm()} on:restart={() => ctrl.restartNewForm()} />
            {:else if $currentView === "form" && $currentStep}
                <div class="fr-col-12 fr-col-lg-10">
                    <div class="fr-mb-6v">
                        <StepIndicator currentStep={$currentStep} {stepsDesc}></StepIndicator>
                    </div>
                    <div class="form-container">
                        <svelte:component
                            this={$currentStepComponent}
                            on:nextStep={() => ctrl.nextStep()}
                            on:prevStep={() => ctrl.prevStep()}
                            on:loading={e => ctrl.loading(e.detail)}
                            on:endLoading={() => ctrl.endLoading()}
                            on:restartNewForm={() => ctrl.restartNewForm()} />

                        {#if $isLoading}
                            <div class="loading-overlay">
                                <Spinner description={$currentLoadingMessage} />
                            </div>
                        {/if}
                    </div>
                </div>
            {/if}
        </div>
    </div>
</main>

<style>
    .form-container {
        position: relative;
    }

    .loading-overlay {
        pointer-events: auto;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: white;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        z-index: 1000;
    }
</style>
