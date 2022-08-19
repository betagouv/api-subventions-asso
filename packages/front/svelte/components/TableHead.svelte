<script>
    import Button from "../dsfr/Button.svelte";

    export let action = undefined;
    export let actionActive = false;
    export let actionDirection = "asc";
    export let actionDisable = false;
</script>

<th class="bg-white" scope="col">
    <div class="{actionActive ? 'active' : ''} {actionActive ? actionDirection : ''}">
        <p>
            <slot />
        </p>
        {#if action}
            <Button on:click={action} disabled={actionDisable} icon="arrow-left-s-line" />
        {/if}
    </div>
</th>

<style>
    th {
        padding: 12px;
        vertical-align: top;
    }

    th div {
        height: 100%;
        max-height: 100%;
        display: flex;
        flex-direction: column;
    }

    p {
        min-height: 100px;
        max-height: 100px;
        overflow: hidden;
    }

    div :global(.fr-btn) {
        transform: rotate(-90deg);
        background-color: transparent;
        color: #e3e3fd;
    }

    div.desc :global(.fr-btn) {
        transform: rotate(90deg);
    }

    div :global(.fr-btn):hover {
        color: #000091;
    }
    div.active :global(.fr-btn) {
        color: #000091;
    }
</style>
