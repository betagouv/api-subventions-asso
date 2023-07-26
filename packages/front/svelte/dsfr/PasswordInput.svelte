<script>
    import { nanoid } from "nanoid";

    export let value;
    export let label;
    export let id = nanoid(7);
    export let error = false;
    export let errorMsg = null;

    let showPassword = false;
    $: iconClasses = `fr-icon--sm ${showPassword ? "fr-icon-eye-line" : "fr-icon-eye-off-line"}`;

    // define validation class
    $: inputGroupClasses = `fr-input-wrap fr-input-group ${error ? "fr-input-group--error" : ""}`;
    $: inputClasses = `fr-password__input fr-input ${error ? "fr-input--error" : ""}`;
</script>

<div class="fr-password" id="password">
    <div class={inputGroupClasses}>
        <label class="fr-label" for="password-input">{label}</label>
        <input
            bind:value
            class={inputClasses}
            aria-required="true"
            name="password-{id}"
            autocomplete="new-password"
            id="password-input-{id}"
            type="password"
            aria-describedby={errorMsg ? `password--error-desc-${id}` : undefined}
            required />
        {#if error && errorMsg}
            <p id="password--error-desc-{id}" class="fr-error-text">{errorMsg}</p>
        {/if}
    </div>
    <div class="fr-messages-group" id="password-input-messages-{id}" aria-live="assertive" />
    <div class="fr-password__checkbox fr-checkbox-group--sm">
        <input
            class="checkbox"
            bind:checked={showPassword}
            aria-label="Afficher le mot de passe"
            id="password-show-{id}"
            type="checkbox"
            aria-describedby="password-show-messages-{id}" />
        <label class="fr-password__checkbox fr-label" for="password-show-{id}">
            <span class={iconClasses} />
        </label>
        <div class="fr-messages-group" id="password-show-messages-{id}" aria-live="assertive" />
    </div>
</div>

<style>
    .checkbox {
        display: none;
    }
</style>
