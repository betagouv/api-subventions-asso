<script>
    export let primary = false;
    export let colspan = undefined;
    export let position = "end";
    console.log({ position });
    const style = `--justify: ${position}`;
</script>

<td {colspan} class:primary>
    <div {style}>
        <slot />
    </div>
</td>

<style>
    td {
        height: 71px;
        max-height: 71px;
    }

    div {
        /* 140-16*2 padding - 1 to avoid bug*/
        display: flex;
        align-items: center;
        justify-content: var(--justify);
        height: 71px;
        max-height: 71px;
        overflow: hidden;
    }

    div :global(.fr-btn),
    div :global(p) {
        justify-self: end;
    }

    td.primary {
        background-color: #f5f5fe;
    }
</style>
