<script lang="ts">
    interface Props {
        // build a unique id from timestamp if not given
        id?: string;
        large?: boolean;
        placeholder?: string;
        disableIfEmpty?: boolean;
        value?: string | undefined;
        label?: string;
        onsubmit?: (value: string | undefined) => void;
        onreset?: () => void;
    }

    let {
        id = Date.now().toString(),
        large = true,
        placeholder = "Nom, n°RNA, n°SIREN ou SIRET",
        disableIfEmpty = true,
        value = $bindable(undefined),
        label = undefined,
        onsubmit = () => {},
        onreset = () => {},
    }: Props = $props();

    async function handleReset() {
        if (value === "") onreset();
    }

    function handleSubmit() {
        onsubmit(value);
    }
</script>

<div class="fr-grid-row fr-grid-row--center fr-grid-row--gutters">
    <div class="fr-col fr-col-lg-12">
        <form
            onsubmit={event => {
                event.preventDefault();
                handleSubmit();
            }}>
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
                    oninput={handleReset} />
                <button class="fr-btn" title="Rechercher" disabled={!value && disableIfEmpty}>Rechercher</button>
            </div>
        </form>
    </div>
</div>
