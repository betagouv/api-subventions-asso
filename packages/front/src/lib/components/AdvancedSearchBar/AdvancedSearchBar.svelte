<script lang="ts">
    type Props = {
        value?: string;
        postalCode?: string;
        onSubmit?: (value: string | undefined, postalCode?: string) => void;
    };

    let { value = $bindable(""), postalCode = $bindable(""), onSubmit = () => undefined }: Props = $props();

    let locationError = $state<string | undefined>();
    let searchInNameOnly = $state(false);

    const LOCATION_REGEX = /^\d{2,5}$/;

    function handleLocationInput(event: Event) {
        postalCode = (event.currentTarget as HTMLInputElement).value.replace(/\D/g, "").slice(0, 5);
        if (!postalCode || LOCATION_REGEX.test(postalCode)) locationError = undefined;
    }

    function handleSubmit() {
        if (!value) return;

        const location = postalCode.trim();
        if (location && !LOCATION_REGEX.test(location)) {
            locationError = "Veuillez renseigner un code postal ou département valide.";
            return;
        }

        locationError = undefined;
        onSubmit(value, location || undefined);
    }
</script>

<form class="search" novalidate onsubmit={event => (event.preventDefault(), handleSubmit())}>
    <div class="fields">
        <div>
            <label class="fr-label" for="advanced-search-name">Nom, mot-clé, identifiant</label>
            <input
                class="fr-input"
                id="advanced-search-name"
                name="search-input"
                placeholder="Ex : Tennis Club, 48213289100011..."
                type="search"
                bind:value />
        </div>
        <div>
            <label class="fr-label" for="advanced-search-location">Code postal ou département</label>
            <input
                class="fr-input"
                id="advanced-search-location"
                name="advanced-search-location"
                placeholder="Ex : 75 ou 75010"
                type="text"
                inputmode="numeric"
                maxlength="5"
                aria-invalid={locationError ? "true" : undefined}
                aria-describedby={locationError ? "advanced-search-location-error" : undefined}
                oninput={handleLocationInput}
                bind:value={postalCode} />
            {#if locationError}
                <p id="advanced-search-location-error" class="fr-error-text">
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
            id="advanced-search-name-only"
            name="advanced-search-name-only"
            type="checkbox"
            bind:checked={searchInNameOnly} />
        <label class="fr-label" for="advanced-search-name-only">Rechercher uniquement dans le nom d’association</label>
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
