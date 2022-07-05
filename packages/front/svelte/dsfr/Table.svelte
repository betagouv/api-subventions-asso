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
