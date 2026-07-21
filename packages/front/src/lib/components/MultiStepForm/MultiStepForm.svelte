<script lang="ts">
    import MultiStepFormController from "./MultiStepForm.controller";
    import Button from "$lib/dsfr/Button.svelte";
    import type { Step } from "./Step";

    interface Props {
        steps?: Step[];
        onSubmit: () => void;
        submitLabel?: string;
        nextLabel?: string;
        previousLabel?: string;
        customSubmitTracking?: boolean;
        trackerFormName: string;
        buildContext?: () => Record<string, unknown>;
    }

    let {
        steps = [],
        onSubmit,
        submitLabel = "Confirmer",
        nextLabel = "Suivant",
        previousLabel = "Précédent",
        customSubmitTracking = false,
        trackerFormName,
        buildContext = () => ({}),
    }: Props = $props();

    const controller = new MultiStepFormController(steps, onSubmit, buildContext);

    const { currentStep, data, isStepBlocked, context } = controller;

    const SvelteComponent_1 = $derived($currentStep.step.component);
</script>

<div class="fr-grid-row">
    <div class="fr-stepper">
        <h2 class="fr-stepper__title">
            {$currentStep.step.name}
            {#if steps.length > 1}
                <span class="fr-stepper__state">Étape {$currentStep.positionLabel} sur {steps.length}</span>
            {/if}
        </h2>
        <div class="fr-stepper__steps" data-fr-current-step={$currentStep.positionLabel} data-fr-steps={steps.length} />
        {#if !$currentStep.isLastStep}
            <p class="fr-stepper__details">
                <span class="fr-text--bold">Étape suivante :</span>
                {$currentStep.nextStepName || `étape ${$currentStep.nextStepPositionLabel}`}
            </p>
        {/if}
    </div>
</div>

<div class="fr-grid-row">
    {#if $currentStep.step.alert}
        {@const SvelteComponent = $currentStep.step.alert}
        <SvelteComponent />
    {/if}
</div>

<div class="fr-grid-row">
    <div class="fr-col-6">
        <form
            action="#"
            method="GET"
            onsubmit={event => {
                event.preventDefault();
                controller.submit();
            }}>
            <SvelteComponent_1
                bind:values={$data[$currentStep.index]}
                context={$context}
                onerror={() => controller.updateValidation(false)}
                onvalid={() => controller.updateValidation(true)} />
            {#if !$currentStep.isFirstStep}
                <Button
                    htmlType="button"
                    type="secondary"
                    onclick={() => controller.previous()}
                    disabled={$currentStep.isFirstStep}
                    trackerName={`${trackerFormName}.form.step${$currentStep.positionLabel}.previous`}>
                    {previousLabel}
                </Button>
            {/if}
            {#if $currentStep.isLastStep}
                <Button
                    htmlType="submit"
                    disabled={$isStepBlocked}
                    trackingDisable={customSubmitTracking}
                    trackerName={customSubmitTracking
                        ? undefined
                        : `${trackerFormName}.form.step${$currentStep.positionLabel}.submit`}>
                    {submitLabel}
                </Button>
            {:else}
                <Button
                    htmlType="button"
                    disabled={$isStepBlocked}
                    type="secondary"
                    onclick={() => controller.next()}
                    onsubmit={() => controller.next()}
                    trackerName={`${trackerFormName}.form.step${$currentStep.positionLabel}.next`}>
                    {nextLabel}
                </Button>
            {/if}
        </form>
    </div>
</div>
