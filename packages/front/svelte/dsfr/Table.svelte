<script>
    export let title = "Résumé du tableau (accessibilité)";
</script>

<div class="fr-table fr-table--bordered">
    <table>
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
        border-collapse: collapse;
    }

    thead tr {
        border-bottom: #3a3a3a solid 2px;
    }

    thead,
    tbody {
        background-color: #ffffff;
    }

    tbody :global(td) {
        border-bottom: 1px #e5e5e5 solid;
    }
</style>
