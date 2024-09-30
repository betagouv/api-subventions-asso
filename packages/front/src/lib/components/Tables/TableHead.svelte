<script>
    import Button from "$lib/dsfr/Button.svelte";

    export let size = undefined;
    export let action = undefined;
    export let actionActive = false;
    export let actionDirection = "asc";
    export let actionDisable = false;

    let width = size ? `width:${size}` : undefined;
    if (width?.slice(-1) !== "%") width += "%";
</script>

<th style={width || null}>
    <div class="header-wrapper {actionActive ? 'active' : ''} {actionActive ? actionDirection : ''}">
        <p>
            <slot />
        </p>
        {#if action}
            <Button
                size="small"
                on:click={action}
                disabled={actionDisable}
                icon="arrow-up-down-line"
                trackingDisable={true} />
        {/if}
    </div>
</th>

<style>
    th .header-wrapper {
        display: flex;
        flex-direction: row;
    }

    th {
        vertical-align: top;
        padding: 0.5rem;
    }

    th div {
        height: 100%;
        max-height: 100%;
        display: flex;
        flex-direction: column;
    }

    p {
        font-size: 0.875rem;
        word-wrap: break-word;
    }

    div :global(.fr-btn) {
        /* sort arrow button */
        background-color: transparent;
        color: var(--blue-france-sun-113-625);
        margin-top: -0.25rem;
    }

    div :global(.fr-btn):hover {
        color: var(--blue-france-sun-113-625-hover);
    }

    div.active :global(.fr-btn) {
        color: var(--blue-france-sun-113-625-active);
    }
</style>
