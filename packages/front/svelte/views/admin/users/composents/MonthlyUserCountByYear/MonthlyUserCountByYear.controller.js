import statsService from "@resources/stats/stats.service";

export class MonthlyUserCountByYearController {
    async loadData(year) {
        const data = await statsService.getMonthlyUserCount(year);

        const monthlyData = [data.lastYearNbUser, ...data.monthlyData];
        const message =
            year === new Date().getFullYear()
                ? `Nouveaux utilisateurs depuis janvier ${year}`
                : `Nouveaux utilisateurs en ${year}`;
        const aggregateStats = [
            {
                message,
                value: `+ ${data.monthlyData[data.monthlyData.length - 1] - data.lastYearNbUser}`,
            },
        ];
        return { monthlyData, aggregateStats };
    }
}
