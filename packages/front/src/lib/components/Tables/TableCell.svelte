<script>
    export let primary = false;
    export let colspan = undefined;
    export let position = "start";
    let style;

    $: style = `--justify: ${position}`;
</script>

<td {colspan} class:primary class="fr-p-1w">
    <div class="table-cell-container" {style}>
        <div class="table-cell-content">
            <slot />
        </div>
    </div>
</td>

<style>
    .table-cell-container {
        display: flex;
        justify-content: var(--justify);
        align-items: center;
        height: 92px;
        max-height: 92px;
    }

    .table-cell-content {
        display: -webkit-box;
        overflow: hidden;
        overflow-wrap: anywhere;
        -webkit-line-clamp: 4;
        -webkit-box-orient: vertical;
    }

    td.primary {
        color: var(--text-active-blue-france);
        font-weight: 500;
    }
</style>
