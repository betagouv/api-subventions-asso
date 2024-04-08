<script>
    import Input from "$lib/dsfr/Input.svelte";

    export let user;
    export let displayOnly = false;
</script>

<div class="fr-fieldset__element fr-fieldset__element--inline fr-fieldset__element--inline-grow">
    <Input
        label="Prénom :"
        autocomplete="given-name"
        id="signup-given-name"
        bind:value={user.firstName}
        disabled={displayOnly ? "true" : undefined}
        on:change
        required={true} />
</div>
<div class="fr-fieldset__element fr-fieldset__element--inline fr-fieldset__element--inline-grow">
    <Input
        label="NOM :"
        autocomplete="family-name"
        id="signup-family-name"
        bind:value={user.lastName}
        disabled={displayOnly ? "true" : undefined}
        required={true}
        on:change />
</div>
<div class="fr-fieldset__element fr-mt-4v">
    <Input
        label="Adresse e-mail professionnelle :"
        id="signup-email"
        hint="A ce jour, l’adresse e-mail n’est pas modifiable."
        value={user.email}
        required={true}
        on:change
        disabled={true} />
</div>
