<script lang="ts">
    import WelcomeForm from "./components/WelcomeForm/WelcomeForm.svelte";
    import ResumeForm from "./components/ResumeForm/ResumeForm.svelte";
    import Step1 from "./components/Step1/Step1.svelte";
    import Step2 from "./components/Step2/Step2.svelte";
    import { onMount } from "svelte";
    import { DepositScdlController } from "./DepositScdl.controller";
    import Step3 from "./components/Step3/Step3.svelte";
    import Spinner from "$lib/components/Spinner.svelte";

    const stepComponents = { 1: Step1, 2: Step2, 3: Step3 };

    const ctrl = new DepositScdlController(stepComponents);
    const { currentStep, currentView, currentStepComponent, stepsDesc, currentLoadingMessage } = ctrl;

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
                    <svelte:component
                        this={$currentStepComponent}
                        {stepsDesc}
                        currentStep={$currentStep}
                        on:nextStep={() => ctrl.nextStep()}
                        on:prevStep={() => ctrl.prevStep()}
                        on:loading={() => ctrl.loading()} />
                </div>
            {:else if $currentView === "loading"}
                <Spinner description={currentLoadingMessage} />
            {/if}
        </div>
    </div>
</main>
