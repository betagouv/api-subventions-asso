<script>
    export let primary = false;
    export let colspan = undefined;
    export let position = "start";
    export let overflow = "hidden";
    let style;

    $: style = `--justify: ${position}; --overflow: ${overflow}`;
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
        overflow: var(--overflow);
        overflow-wrap: anywhere;
    }

    td {
        line-break: anywhere;
        padding: 12px;
    }

    td.primary {
        color: var(--text-active-blue-france);
        font-weight: 500;
    }
</style>
