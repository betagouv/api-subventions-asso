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
    <div class="{actionActive ? 'active' : ''} {actionActive ? actionDirection : ''}">
        <p>
            <slot />
        </p>
        {#if action}
            <Button on:click={action} disabled={actionDisable} icon="arrow-left-s-line" trackingDisable={true} />
        {/if}
    </div>
</th>

<style>
    th {
        vertical-align: top;
    }

    th div {
        height: 100%;
        max-height: 100%;
        display: flex;
        flex-direction: column;
    }

    p {
        min-height: 3rem;
        max-height: 3rem;
        font-size: 0.875rem;
        word-wrap: break-word;
    }

    div :global(.fr-btn) {
        transform: rotate(-90deg);
        background-color: transparent;
        color: var(--text-action-high-grey);
        margin-left: -0.5rem;
    }

    div.desc :global(.fr-btn) {
        transform: rotate(90deg);
    }

    div :global(.fr-btn):hover {
        color: var(--blue-cumulus-925-125-active);
    }
    div.active :global(.fr-btn) {
        color: var(--blue-cumulus-925-125-active);
    }
</style>
