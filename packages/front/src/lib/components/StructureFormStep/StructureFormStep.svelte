<script lang="ts">
    import { FromTypeEnum } from "dto";
    import StructureFormStepController from "./StructureFormStep.controller";
    import Checkbox from "$lib/dsfr/Checkbox.svelte";
    import Input from "$lib/dsfr/Input.svelte";

    export let values = {
        service: "",
        jobType: [],
        phoneNumber: "",
        from: [] as FromTypeEnum[],
        fromEmail: "",
        fromOther: "",
    };
    export let context = {};

    const ctrl = new StructureFormStepController();
    // @ts-expect-error: TODO - Why do we accept context as empty object ?
    $: ctrl.onUpdateContext(context, values);

    const { errors, subStep } = ctrl;
</script>

{#if $subStep}
    <svelte:component this={$subStep.component} bind:values on:change />
{/if}

<fieldset class="fr-fieldset">
    <div class="fr-fieldset__element">
        <Input
            id="service-input"
            type="text"
            label="Quel est votre service ?"
            bind:value={values.service}
            errorMsg={$errors.service}
            error={$errors.service}
            on:change
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
            on:change
            on:blur={() => ctrl.onUpdate(values, "phoneNumber")} />
    </div>

    <div class="fr-fieldset__element fr-mb-0 fr-mt-4v">
        <Checkbox
            options={ctrl.fromOptions}
            label="Comment avez-vous connu Data.Subvention ?"
            errorMsg={$errors.from}
            on:change={() => ctrl.onUpdateFrom(values)}
            bind:value={values.from} />
    </div>

    {#if values?.from && values?.from.includes(FromTypeEnum.COLLEAGUES_HIERARCHY)}
        <div class="fr-fieldset__element">
            <Input
                id="fromEmail-input"
                type="email"
                label="Pouvez-vous nous indiquer son email ?"
                autocomplete="email"
                bind:value={values.fromEmail}
                errorMsg={$errors.fromEmail}
                error={$errors.fromEmail}
                on:change
                on:blur={() => ctrl.onUpdate(values, "fromEmail")} />
        </div>
    {/if}
    {#if values?.from && values?.from.includes(FromTypeEnum.OTHER)}
        <div class="fr-fieldset__element">
            <Input
                id="fromOther-input"
                type="text"
                label="Précisez"
                bind:value={values.fromOther}
                on:change
                on:blur={() => ctrl.onUpdate(values, "fromOther")} />
        </div>
    {/if}
</fieldset>
