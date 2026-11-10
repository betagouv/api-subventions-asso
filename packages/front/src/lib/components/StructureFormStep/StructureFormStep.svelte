<script lang="ts">
    import { RegistrationSrcTypeEnum } from "dto";
    import StructureFormStepController from "./StructureFormStep.controller";
    import Checkbox from "$lib/dsfr/Checkbox.svelte";
    import Input from "$lib/dsfr/Input.svelte";

    let {
        values = $bindable({
            service: "",
            jobType: [],
            phoneNumber: "",
            registrationSrc: [] as RegistrationSrcTypeEnum[],
            registrationSrcEmail: "",
            registrationSrcDetails: "",
        }),
        context = {},
        onchange = () => {},
        onerror = () => {},
        onvalid = () => {},
    } = $props();

    const ctrl = new StructureFormStepController(event => {
        if (event === "change") onchange();
        else if (event === "error") onerror();
        else onvalid();
    });
    $effect(() => {
        // @ts-expect-error: TODO - Why do we accept context as empty object ?
        ctrl.onUpdateContext(context, values);
    });

    const { errors, subStep } = ctrl;
    let service = $derived(values.service);

    function notifyChange() {
        onchange();
    }

    function updateField(field: string) {
        ctrl.onUpdate(values, field);
    }

    function updateRegistrationSrc() {
        ctrl.onUpdateRegistrationSrc(values);
    }
</script>

{#if $subStep}
    {@const SvelteComponent = $subStep.component}
    <SvelteComponent bind:values onchange={() => onchange()} />
{/if}

<fieldset class="fr-fieldset">
    <div class="fr-fieldset__element">
        <Input
            id="service-input"
            type="text"
            label="Quel est votre service ?"
            bind:value={service}
            errorMsg={$errors.service}
            error={$errors.service}
            onchange={() => notifyChange()}
            onblur={() => updateField("service")} />
    </div>
    <div class="fr-fieldset__element fr-mb-0 fr-mt-4v">
        <Checkbox
            options={ctrl.jobTypeOptions}
            label="Quel type de poste occupez-vous ?"
            errorMsg={$errors.jobType}
            onchange={() => updateField("jobType")}
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
            onchange={() => notifyChange()}
            onblur={() => updateField("phoneNumber")} />
    </div>

    <div class="fr-fieldset__element fr-mb-0 fr-mt-4v">
        <Checkbox
            options={ctrl.registrationSrcOptions}
            label="Comment avez-vous connu Data.Subvention ?"
            errorMsg={$errors.registrationSrc}
            onchange={() => updateRegistrationSrc()}
            bind:value={values.registrationSrc} />
    </div>

    {#if ctrl.isRegistrationSrcEmailVisible(values.registrationSrc)}
        <div class="fr-fieldset__element">
            <Input
                id="registrationSrcEmail-input"
                type="email"
                label="Pouvez-vous nous indiquer son email ?"
                autocomplete="email"
                bind:value={values.registrationSrcEmail}
                errorMsg={$errors.registrationSrcEmail}
                error={$errors.registrationSrcEmail}
                onchange={() => notifyChange()}
                onblur={() => updateField("registrationSrcEmail")} />
        </div>
    {/if}
    {#if ctrl.isRegistrationSrcDetailsVisible(values.registrationSrc)}
        <div class="fr-fieldset__element">
            <Input
                id="registrationSrcDetails-input"
                type="text"
                label="Précisez"
                bind:value={values.registrationSrcDetails}
                onchange={() => notifyChange()}
                onblur={() => updateField("registrationSrcDetails")} />
        </div>
    {/if}
</fieldset>
