<script>
    export let title = "Résumé du tableau (accessibilité)";
    export let bordered = false;
    export let color;
</script>

<div class="fr-table {color ? `.fr-highlight--${color}` : ''}" class:fr-table--bordered={bordered}>
    <table>
        <slot name="colgroup" />
        <caption class="sr-only">{title}</caption>
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
    /* TODO: export this to avoid modifying DSFR components */
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

    tbody :global(td) {
        border-bottom: 1px #e5e5e5 solid;
    }

    .fr-table--bordered table {
        border: 2px solid #2e2e2e;
    }
</style>
