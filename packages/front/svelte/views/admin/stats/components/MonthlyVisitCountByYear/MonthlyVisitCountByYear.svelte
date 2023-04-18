<script>
    import { MonthlyVisitCountByYearController } from "./MonthlyVisitCountByYearController";
    import MonthlyGraph from "@components/Stats/MonthlyGraph/MonthlyGraph.svelte";

    const { loadData } = new MonthlyVisitCountByYearController();
</script>

<MonthlyGraph title="Fréquence d'usage : Nombre total de requêtes" {loadData} resourceName="Requêtes" />
