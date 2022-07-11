<script>
    export let primary = false;
    export let colspan = undefined;
    export let position = "start";

    $: style = `--justify: ${position}`;
</script>

<td {colspan} class:primary>
    <div {style}>
        <slot />
    </div>
</td>

<style>
    div {
        display: flex;
        justify-content: var(--justify);
        align-items: center;
        height: 92px;
        max-height: 92px;
        overflow: hidden;
    }

    td {
        padding: 12px;
    }

    td.primary {
        background-color: #f5f5fe;
    }
</style>
