<script lang="ts">
    import { nanoid } from "nanoid";

    interface Props {
        value: string | undefined;
        label: string;
        id?: string;
        name?: string;
        error?: boolean;
        errorMsg?: string | null;
        forgetPasswordUrl?: string;
    }

    let {
        value = $bindable(),
        label,
        id = nanoid(7),
        name = `password-input-${id}`,
        error = false,
        errorMsg = null,
        forgetPasswordUrl = undefined,
    }: Props = $props();

    const descErrorElement = `${name}-desc-error`;

    // define validation class
    let inputClasses = $derived(`fr-password__input fr-input ${error ? "fr-input--error" : ""}`);
</script>

<div class="fr-password" id="password">
    <label class="fr-label" for="password-input">{label}</label>
    <div class="fr-input-wrap">
        <input
            bind:value
            class={inputClasses}
            aria-required="true"
            name="password-{id}"
            autocomplete="new-password"
            id="password-input-{id}"
            type="password"
            aria-invalid={error ? "true" : undefined}
            aria-errormessage={errorMsg ? descErrorElement : undefined}
            data-fr-error={error ? "en erreur" : undefined}
            required />
        {#if error && errorMsg}
            <p id={descErrorElement} class="fr-error-text">{errorMsg}</p>
        {/if}
    </div>
    <div class="fr-messages-group" id="password-input-messages-{id}" aria-live="polite" />
    <div class="fr-password__checkbox fr-checkbox-group fr-checkbox-group--sm">
        <input aria-label="Afficher le mot de passe" id="password-show" type="checkbox" />
        <label class="fr-label" for="password-show">Afficher</label>
    </div>
    {#if forgetPasswordUrl}
        <p>
            <a href={forgetPasswordUrl} class="fr-link">Mot de passe oublié ?</a>
        </p>
    {/if}
</div>
