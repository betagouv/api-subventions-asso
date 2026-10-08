<script lang="ts">
    interface Props {
        // build a unique id from timestamp if not given
        id?: string;
        large?: boolean;
        placeholder?: string;
        disableIfEmpty?: boolean;
        value?: string | undefined;
        label?: string;
        compactHeight?: boolean;
        onSubmit?: (value: string | undefined) => void;
        onReset?: () => void;
    }

    let {
        id = Date.now().toString(),
        large = true,
        placeholder = "Nom, n°RNA, n°SIREN ou SIRET",
        disableIfEmpty = true,
        value = $bindable(undefined),
        label = undefined,
        compactHeight = false,
        onSubmit = () => undefined,
        onReset = () => undefined,
    }: Props = $props();

    async function handleReset() {
        if (value === "") onReset();
    }

    function handleSubmit() {
        onSubmit(value);
    }
</script>

<div class="fr-grid-row fr-grid-row--center fr-grid-row--gutters">
    <div class="fr-col fr-col-lg-12">
        <form
            onsubmit={event => {
                event.preventDefault();
                handleSubmit();
            }}>
            <div
                class="fr-search-bar"
                class:fr-search-bar--lg={large}
                class:compact-height={compactHeight}
                id="search-input-{id}">
                {#if label}
                    <label class="fr-label" for="search-input-{id}">
                        {label}
                    </label>
                {/if}
                <input
                    class="fr-input"
                    {placeholder}
                    type="search"
                    lang="fr"
                    spellcheck="true"
                    id="search-input-{id}"
                    name="search-input"
                    bind:value
                    oninput={handleReset} />
                <button class="fr-btn" title="Rechercher" disabled={!value && disableIfEmpty}>Rechercher</button>
            </div>
        </form>
    </div>
</div>

<style>
    .fr-search-bar.compact-height {
        height: 48px;
    }

    .fr-search-bar.compact-height .fr-input,
    .fr-search-bar.compact-height .fr-btn {
        height: 48px;
        min-height: 48px;
    }

    .fr-search-bar.compact-height .fr-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 178px;
        flex-basis: 178px;
        padding: 0 1rem;
        line-height: 1;
    }
</style>
