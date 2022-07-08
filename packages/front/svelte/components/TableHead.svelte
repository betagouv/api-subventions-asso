<script>
    import Button from "../dsfr/Button.svelte";

    export let action = undefined;
</script>

<th scope="col">
    <div>
        <p>
            <slot />
        </p>
        {#if action}
            <Button on:click={action} disabled="true" icon="arrow-left-s-line" />
        {/if}
    </div>
</th>

<style>
    th {
        padding-bottom: 0px;
        height: 88px;
        max-height: 88px;
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

    div :global(.fr-btn):hover {
        color: #000091;
    }
</style>
