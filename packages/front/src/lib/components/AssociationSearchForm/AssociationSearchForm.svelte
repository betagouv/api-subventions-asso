<script lang="ts">
    import SpellcheckedInput from "$lib/components/SpellcheckedInput/SpellcheckedInput.svelte";

    type Props = {
        value?: string;
        location?: string;
        nameOnly?: boolean;
        onSubmit?: (value: string, location: string | undefined, nameOnly: boolean) => void;
    };

    let {
        value = $bindable(""),
        location = $bindable(""),
        nameOnly = $bindable(false),
        onSubmit = () => undefined,
    }: Props = $props();

    let locationError = $state<string | undefined>();

    const LOCATION_REGEX = /^(?:\d{2,3}|2[AB]|\d{5})$/;

    function handleLocationInput(event: Event) {
        location = (event.currentTarget as HTMLInputElement).value
            .toUpperCase()
            .replace(/[^\dAB]/g, "")
            .slice(0, 5);
        if (!location || LOCATION_REGEX.test(location)) locationError = undefined;
    }

    function handleSubmit() {
        if (!value) return;

        const normalizedLocation = location.trim().toUpperCase();
        if (normalizedLocation && !LOCATION_REGEX.test(normalizedLocation)) {
            locationError = "Veuillez renseigner un code postal ou département valide.";
            return;
        }

        locationError = undefined;
        onSubmit(value, normalizedLocation || undefined, nameOnly);
    }
</script>

<form class="search" novalidate onsubmit={event => (event.preventDefault(), handleSubmit())}>
    <div class="fields">
        <div>
            <label class="fr-label" for="association-search-name">Nom, mot-clé, identifiant</label>
            <SpellcheckedInput
                id="association-search-name"
                name="search-input"
                placeholder="Ex : Tennis Club, 48213289100011..."
                bind:value />
        </div>
        <div>
            <label class="fr-label" for="association-search-location">Code postal ou département</label>
            <input
                class="fr-input"
                id="association-search-location"
                name="association-search-location"
                placeholder="Ex : 2A ou 75010"
                type="text"
                maxlength="5"
                aria-invalid={locationError ? "true" : undefined}
                aria-describedby={locationError ? "association-search-location-error" : undefined}
                oninput={handleLocationInput}
                bind:value={location} />
            {#if locationError}
                <p id="association-search-location-error" class="fr-error-text">
                    {locationError}
                </p>
            {/if}
        </div>
        <button class="fr-btn submit">
            <span class="fr-icon-search-line" aria-hidden="true"></span>
            <span>Rechercher</span>
        </button>
    </div>
    <div class="fr-checkbox-group checkbox">
        <input
            id="association-search-name-only"
            name="association-search-name-only"
            type="checkbox"
            bind:checked={nameOnly} />
        <label class="fr-label" for="association-search-name-only">
            Rechercher uniquement dans le nom d’association
        </label>
    </div>
</form>

<style>
    .search {
        padding: 2rem;
        border: 1px solid var(--border-default-grey);
    }

    .search > .fields {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(16rem, 0.43fr) auto;
        gap: 1rem;
    }

    .search > .checkbox {
        margin-top: 1.5rem;
    }

    .fields > .submit {
        align-self: start;
        margin-top: 2rem;
    }

    @media (max-width: 62em) {
        .search > .fields {
            grid-template-columns: 1fr;
            gap: 1rem;
        }

        .fields > .submit {
            margin-top: 0;
        }
    }
</style>
