<script lang="ts">
    import { createEventDispatcher } from "svelte";
    // build a unique id from timestamp if not given
    export let id = Date.now().toString();
    export let large = true;
    export let placeholder = "Nom, n°RNA, n°SIREN ou SIRET";
    export let disableIfEmpty = true;
    export let value = undefined;
    export let label = undefined;

    const dispatch = createEventDispatcher();

    async function handleReset() {
        if (value === "") dispatch("reset");
    }

    function handleSubmit() {
        dispatch("submit", value);
    }
</script>

<div class="fr-grid-row fr-grid-row--center fr-grid-row--gutters">
    <div class="fr-col fr-col-lg-12">
        <form on:submit|preventDefault={handleSubmit}>
            <div class="fr-search-bar" class:fr-search-bar--lg={large} id="search-input-{id}">
                {#if label}
                    <label class="fr-label" for="search-input-{id}">
                        {label}
                    </label>
                {/if}
                <input
                    class="fr-input"
                    {placeholder}
                    type="search"
                    id="search-input-{id}"
                    name="search-input"
                    bind:value
                    on:input={handleReset} />
                <button class="fr-btn" title="Rechercher" disabled={!value && disableIfEmpty}>Rechercher</button>
            </div>
        </form>
    </div>
</div>
