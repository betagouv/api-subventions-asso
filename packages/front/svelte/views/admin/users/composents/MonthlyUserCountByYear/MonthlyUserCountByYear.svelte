<script>
    import { MonthlyUserCountByYearController } from "./MonthlyUserCountByYear.controller";
    import MonthlyGraph from "@components/Stats/MonthlyGraph/MonthlyGraph.svelte";

    const { loadData } = new MonthlyUserCountByYearController();
</script>

<MonthlyGraph title="Nombre d'utilisateurs" {loadData} withPreviousValue resourceName="Utilisateurs" />
