<script>
    import { PAGE_ADMIN_STATS_NAME } from "../admin.constant";
    import TopAssociations from "./components/TopAssociations/TopAssociations.svelte";
    import MonthlyRequestCountByYear from "./components/MonthlyRequestCountByYear/MonthlyRequestCountByYear.svelte";
</script>

<h1 class="fr-h2 fr-mb-6w">{PAGE_ADMIN_STATS_NAME}</h1>

<div class="fr-grid-row fr-mb-5v">
    <!-- TODO fréquences moyenne requêtes mensuelles par utilisateur -->
    <div class="fr-col-6">
        <TopAssociations />
    </div>
</div>
<div class="fr-grid-row">
    <div class="fr-col">
        <MonthlyRequestCountByYear />
    </div>
</div>

<style></style>
