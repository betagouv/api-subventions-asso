<script lang="ts">
    import Input from "$lib/dsfr/Input.svelte";

    type SignupUser = {
        firstName: string;
        lastName: string;
        email: string;
    };

    interface Props {
        user: SignupUser;
        readOnly?: boolean;
        onchange?: () => void;
    }

    let { user = $bindable(), readOnly = false, onchange = () => {} }: Props = $props();
    let firstName = $state(user.firstName);
    let lastName = $state(user.lastName);

    function updateUser() {
        user.firstName = firstName;
        user.lastName = lastName;
        onchange();
    }
</script>

<div class="fr-fieldset__element fr-fieldset__element--inline fr-fieldset__element--inline-grow">
    <Input
        label="Prénom :"
        autocomplete="given-name"
        id="signup-given-name"
        bind:value={firstName}
        disabled={readOnly ? "true" : undefined}
        onchange={() => updateUser()}
        required={true} />
</div>
<div class="fr-fieldset__element fr-fieldset__element--inline fr-fieldset__element--inline-grow">
    <Input
        label="NOM :"
        autocomplete="family-name"
        id="signup-family-name"
        bind:value={lastName}
        disabled={readOnly ? "true" : undefined}
        required={true}
        onchange={() => updateUser()} />
</div>
<div class="fr-fieldset__element fr-mt-4v">
    <Input
        label="Adresse e-mail professionnelle :"
        id="signup-email"
        hint="A ce jour, l’adresse e-mail n’est pas modifiable."
        value={user.email}
        required={true}
        onchange={() => onchange()}
        disabled={true} />
</div>
