<script>
    import { MonthlyRequestCountByYearController } from "./MonthlyRequestCountByYear.controller";
    import MonthlyGraph from "$lib/components/Stats/MonthlyGraph/MonthlyGraph.svelte";

    const { loadData } = new MonthlyRequestCountByYearController();
</script>

<MonthlyGraph title="Fréquence d'usage : Nombre total de requêtes" {loadData} resourceName="Requêtes" />
