<script>
    export let primary = false;
    export let colspan = undefined;
    export let position = "start";
    export let overflow = "hidden";

    $: style = `--justify: ${position}; --overflow: ${overflow}`;
</script>

<td class="bg-white" {colspan} class:primary>
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
        padding: 12px;
    }
</style>
