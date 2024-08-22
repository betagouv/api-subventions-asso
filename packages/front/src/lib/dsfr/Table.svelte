<script>
    export let title = "Résumé du tableau (accessibilité)";
    export let bordered = false;
    export let custom = false;
    export let multiline = false;
    export let caption = false;
</script>

<div
    class="fr-table"
    class:custom-table={custom}
    class:fr-table--bordered={bordered}
    class:fr-table--no-caption={!caption}>
    <div class="fr-table__wrapper">
        <div class="fr-table__container">
            <div class="fr-table__content">
                <table class:fr-cell--multiline={multiline}>
                    <slot name="colgroup" />
                    <caption>{title}</caption>
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
        </div>
    </div>
</div>

<style>
    table {
        border: none;
        display: table;
        border-collapse: collapse;
        overflow: hidden;
    }

    /* CUSTOM */

    .custom-table .fr-table__wrapper::after {
        background: none;
    }

    .custom-table {
        margin-bottom: 0px;
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
