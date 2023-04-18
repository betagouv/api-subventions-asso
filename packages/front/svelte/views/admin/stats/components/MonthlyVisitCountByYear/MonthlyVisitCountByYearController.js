import statsService from "@resources/stats/stats.service";

export class MonthlyVisitCountByYearController {
    async loadData(year) {
        const data = await statsService.getMonthlyVisitCount(year);

        const monthlyData = data.monthlyData;
        const aggregateStats = [
            {
                message: `Nombre total de requêtes en ${year}`,
                value: data.sum,
            },
            {
                message: `Nombre moyen de requêtes par mois`,
                value: data.average.toFixed(),
            },
        ];
        return { monthlyData, aggregateStats };
    }
}
