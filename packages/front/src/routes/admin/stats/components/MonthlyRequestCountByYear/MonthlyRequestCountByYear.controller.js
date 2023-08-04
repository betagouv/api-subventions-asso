import statsService from "$lib/resources/stats/stats.service";

export class MonthlyRequestCountByYearController {
    async loadData(year) {
        const data = await statsService.getMonthlyRequestCount(year);

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
