<script>
    import MonthlyGraph from "@components/Stats/MonthlyGraph/MonthlyGraph.svelte";
    import { MonthlyUserCountByYearController } from "./MonthlyUserCountByYear.controller";

    const { loadData } = new MonthlyUserCountByYearController();
</script>

<MonthlyGraph title="Nombre d'utilisateurs" {loadData} withPreviousValue resourceName="Utilisateurs" />
