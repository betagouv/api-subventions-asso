<script lang="ts">
    import { depositLogStore } from "$lib/store/depositLog.store";
    import WelcomeForm from "./components/WelcomeForm/WelcomeForm.svelte";
    import ResumeForm from "./components/ResumeForm/ResumeForm.svelte";
    import Step1 from "./components/Step1/Step1.svelte";
    import Step2 from "./components/Step2/Step2.svelte";
    import { onMount } from "svelte";
    import { goToUrl } from "$lib/services/router.service";

    const stepsDesc = [
        "Information sur la mise à jour des données",
        "Pour qui déposez-vous ce jeu de données ?",
        "Déposer votre fichier au format SCDL",
        "Résumé de votre dépôt",
        "Finalisation du dépôt",
    ];

    let currentStep: number | null = null;
    let currentView: "loading" | "welcome" | "resume" | "form" = "loading";

    const stepComponents = { 1: Step1, 2: Step2 };

    onMount(async () => {
        if ($depositLogStore == null) {
            currentView = "welcome";
            currentStep = null;
        } else {
            currentView = "resume";
            currentStep = $depositLogStore.step + 1;
        }
    });

    $: currentStepComponent = currentStep ? stepComponents[currentStep] : stepComponents[1];

    function startNewForm() {
        currentView = "form";
        currentStep = 1;
    }

    async function restartNewForm() {
        currentView = "welcome";
        currentStep = null;
    }

    function resumeForm() {
        currentView = "form";
        // currentStep = $depositLogStore!.step + 2; // todo faire une fonction claire
        currentStep = $depositLogStore!.step + 1; // pour test
    }

    function nextStep() {
        if (currentStep && currentStep < 5) {
            currentStep++;
        } // todo: else pour aller vers l'accueil
    }

    function prevStep() {
        if (currentStep === 5) {
            currentView = "welcome";
            currentStep = null;
            return goToUrl("/");
        }
        if (!currentStep || currentStep === 1) {
            currentView = "welcome";
            currentStep = null;
            return;
        }
        currentStep--;
    }
</script>

<main>
    <div class="fr-container fr-mt-14v">
        <div class="fr-grid-row fr-grid-row--center">
            {#if currentView === "welcome"}
                <WelcomeForm on:start={startNewForm} />
            {:else if currentView === "resume"}
                <ResumeForm on:resume={resumeForm} on:restart={restartNewForm} />
            {:else if currentView === "form" && currentStep}
                <svelte:component
                    this={currentStepComponent}
                    {stepsDesc}
                    {currentStep}
                    on:nextStep={nextStep}
                    on:prevStep={prevStep} />
            {/if}
        </div>
    </div>
</main>
