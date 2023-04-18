import statsService from "../../../../../resources/stats/stats.service";
import { MonthlyVisitCountByYearController } from "./MonthlyVisitCountByYearController";

describe("MonthlyRequestCountByYearController", () => {
    describe("loadData", () => {
        const spyService = jest.spyOn(statsService, "getMonthlyRequestCount");
        const DATA = {
            monthlyData: [23, 24],
            sum: 1,
            average: 5.7,
        };
        const YEAR = 2022;
        let ctrl;

        beforeAll(() => {
            spyService.mockResolvedValue(DATA);
            ctrl = new MonthlyVisitCountByYearController();
        });
        afterAll(() => spyService.mockRestore());

        it("gets data from service", async () => {
            await ctrl.loadData(YEAR);
            expect(spyService).toBeCalledWith(YEAR);
        });

        it("send proper monthly data", async () => {
            const expected = [23, 24];
            const actual = (await ctrl.loadData(YEAR)).monthlyData;
            expect(actual).toEqual(expected);
        });

        it.each`
            index | value | message
            ${0}  | ${1}  | ${"Nombre de requêtes en 2022"}
            ${1}  | ${6}  | ${"Nombre moyen de requêtes par mois"}
        `("sets correct aggregateStats index $index", async ({ year, propertyName, expected }) => {
            const actual = (await ctrl.loadData(year)).aggregateStats[0][propertyName];
            expect(actual).toBe(expected);
        });
    });
});
