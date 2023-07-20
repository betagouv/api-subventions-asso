<script>
    import { PAGE_ADMIN_USERS_METRICS_NAME } from "../admin.constant";
    import MonthlyUserCountByYear from "./composents/MonthlyUserCountByYear/MonthlyUserCountByYear.svelte";
    import UserDistribution from "./composents/UserDistribution/UserDistribution.svelte";
</script>

<h1 class="fr-h2 fr-mb-6w">{PAGE_ADMIN_USERS_METRICS_NAME}</h1>
<div class="fr-grid-row fr-mb-5v">
    <div class="fr-col-6">
        <UserDistribution />
    </div>
    <!-- TODO répartition utilisateurs et répartition géographique -->
</div>
<div class="fr-grid-row">
    <div class="fr-col">
        <MonthlyUserCountByYear />
    </div>
</div>
