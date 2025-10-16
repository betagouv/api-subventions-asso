<script>
    import StepIndicator from "$lib/components/StepIndicator/StepIndicator.svelte";
    import { page } from "$app/stores";

    const stepsDesc = [
        "Information sur la mise à jour des données",
        "Pour qui déposez-vous ce jeu de données ?",
        "Déposer votre fichier au format SCDL",
        "Résumé de votre dépôt",
        "Finalisation du dépôt",
    ];

    $: currentStep = extractStepFromPath($page.url.pathname);

    function extractStepFromPath(path) {
        const match = path.match(/etape-(\d+)/);
        if (match && match[1]) {
            return parseInt(match[1], 10);
        }
        return 1;
    }
</script>

<div class="fr-container fr-mt-14v">
    <div class="fr-grid-row fr-grid-row--center">
        <div class="fr-col-12 fr-col-lg-11">
            <div class="fr-mb-6v">
                <StepIndicator {currentStep} {stepsDesc}></StepIndicator>
            </div>

            <slot></slot>
        </div>
    </div>
</div>
