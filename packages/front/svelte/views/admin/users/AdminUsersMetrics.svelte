<script>
    import { PAGE_ADMIN_USERS_METRICS_NAME } from "../admin.constant";
    import Widget from "../../../components/Widget.svelte";
    import MonthlyUserCountByYear from "./composents/MonthlyUserCountByYear/MonthlyUserCountByYear.svelte";
</script>

<h1 class="fr-h2 fr-mb-6w">{PAGE_ADMIN_USERS_METRICS_NAME}</h1>
<div class="fr-grid-row">
    <!-- TODO répartition utilisateurs et répartition géographique -->
</div>
<div class="fr-grid-row">
    <div class="fr-col">
        <Widget title="Nombre d'utilisateurs">
            <MonthlyUserCountByYear />
        </Widget>
    </div>
</div>
