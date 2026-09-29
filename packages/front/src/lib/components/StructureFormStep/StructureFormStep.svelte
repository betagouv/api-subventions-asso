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
    // @ts-expect-error: TODO - Why do we accept context as empty object ?
    $effect(() => {
        ctrl.onUpdateContext(context, values);
    });

    const { errors, subStep } = ctrl;
    let service = $derived(values.service);
    let jobType = $derived(values.jobType);
    let phoneNumber = $derived(values.phoneNumber);
    let registrationSrc = $derived(values.registrationSrc);
    let registrationSrcEmail = $derived(values.registrationSrcEmail);
    let registrationSrcDetails = $derived(values.registrationSrcDetails);

    function syncValues() {
        values.service = service;
        values.jobType = jobType;
        values.phoneNumber = phoneNumber;
        values.registrationSrc = registrationSrc;
        values.registrationSrcEmail = registrationSrcEmail;
        values.registrationSrcDetails = registrationSrcDetails;
    }

    function notifyChange() {
        syncValues();
        onchange();
    }

    function updateField(field: string) {
        syncValues();
        ctrl.onUpdate(values, field);
    }

    function updateRegistrationSrc() {
        syncValues();
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
            bind:value={jobType} />
    </div>
    <div class="fr-fieldset__element">
        <Input
            id="phone-input"
            type="tel"
            label="Numéro de téléphone professionnel"
            hint="Cette information est demandée à des fins d'authentification. Vous pouvez renseigner un numéro fixe ou mobile."
            autocomplete="tel"
            placeholder="Ex : +33 1 00 00 00 00"
            bind:value={phoneNumber}
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
            bind:value={registrationSrc} />
    </div>

    {#if ctrl.isRegistrationSrcEmailVisible(registrationSrc)}
        <div class="fr-fieldset__element">
            <Input
                id="registrationSrcEmail-input"
                type="email"
                label="Pouvez-vous nous indiquer son email ?"
                autocomplete="email"
                bind:value={registrationSrcEmail}
                errorMsg={$errors.registrationSrcEmail}
                error={$errors.registrationSrcEmail}
                onchange={() => notifyChange()}
                onblur={() => updateField("registrationSrcEmail")} />
        </div>
    {/if}
    {#if ctrl.isRegistrationSrcDetailsVisible(registrationSrc)}
        <div class="fr-fieldset__element">
            <Input
                id="registrationSrcDetails-input"
                type="text"
                label="Précisez"
                bind:value={registrationSrcDetails}
                onchange={() => notifyChange()}
                onblur={() => updateField("registrationSrcDetails")} />
        </div>
    {/if}
</fieldset>
