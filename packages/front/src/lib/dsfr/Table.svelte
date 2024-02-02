<script>
    export let title = "Résumé du tableau (accessibilité)";
    export let bordered = false;
    export let color = undefined;
</script>

<div class="fr-table {color ? `fr-table--${color}` : ''} custom-table" class:fr-table--bordered={bordered}>
    <table>
        <slot name="colgroup" />
        <caption class="fr-sr-only">{title}</caption>
        <thead>
            <tr>
                <slot name="head" />
            </tr>
        </thead>
        <tbody>
            <slot name="body" />
        </tbody>
    </table>
</div>

<style>
    table {
        display: table;
        table-layout: fixed;
        border-collapse: collapse;
        overflow: hidden;
    }

    thead tr {
        border-bottom: #3a3a3a solid 2px;
    }

    thead {
        box-shadow: none;
    }

    .fr-table--bordered table {
        border: 2px solid #2e2e2e;
    }

    .custom-table {
        margin-bottom: 0px;
    }

    .custom-table :global(tbody tr),
    .custom-table :global(thead th) {
        border-bottom: 1px #e5e5e5 solid;
        background-color: var(--background-default-grey);
    }

    .custom-table :global(tbody tr):last-of-type {
        border-bottom: none;
    }

    .custom-table :global(tr.clickable) {
        cursor: pointer;
    }

    .custom-table :global(tr.clickable:hover td),
    :global(tr.clickable:focus-within td) {
        background-color: var(--background-alt-grey);
    }
</style>
