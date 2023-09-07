<script>
    import StructureStepController from "./StructureStep.controller";
    import Checkbox from "$lib/dsfr/Checkbox.svelte";
    import Input from "$lib/dsfr/Input.svelte";

    export let values = {
        service: "",
        jobType: [],
        phoneNumber: "",
    };
    export let context = {};

    const ctrl = new StructureStepController();
    $: ctrl.onUpdateContext(context);

    const { errors, subStep } = ctrl;
</script>

{#if $subStep}
    <svelte:component this={$subStep.component} bind:values />
{/if}

<fieldset class="fr-fieldset">
    <div class="fr-fieldset__element">
        <!-- TODO check margins in other substeps -->
        <Input
            id="service-input"
            type="text"
            label="Quel est votre service ?"
            bind:value={values.service}
            errorMsg={$errors.service}
            error={$errors.service}
            on:blur={() => ctrl.onUpdate(values, "service")} />
    </div>
    <div class="fr-fieldset__element fr-mb-0 fr-mt-4v">
        <Checkbox
            options={ctrl.jobTypeOptions}
            label="Quel type de poste occupez-vous ?"
            errorMsg={$errors.jobType}
            on:change={() => ctrl.onUpdate(values, "jobType")}
            bind:value={values.jobType} />
    </div>
    <div class="fr-fieldset__element">
        <Input
            id="phone-input"
            type="tel"
            label="Numéro de téléphone professionnel"
            hint="Cette information est demandée à des fins d'authentification. Vous pouvez renseigner un numéro fixe ou mobile."
            autocomplete="tel"
            placeholder="Ex : +33 1 00 00 00 00"
            bind:value={values.phoneNumber}
            errorMsg={$errors.phoneNumber}
            error={$errors.phoneNumber}
            on:blur={() => ctrl.onUpdate(values, "phoneNumber")} />
    </div>
</fieldset>
