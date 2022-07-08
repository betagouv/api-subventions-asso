<script>
    export let primary = false;
    export let colspan = undefined;
</script>

<td {colspan} class:primary>
    <div style="--justify: {colspan ? 'center' : 'end'}">
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
        justify-content: var(--justify);
        align-items: center;
        height: 71px;
        max-height: 71px;
    }

    td.primary {
        background-color: #f5f5fe;
    }
</style>
