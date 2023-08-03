import { MonthlyUserCountByYearController } from "./MonthlyUserCountByYear.controller";
import statsService from "$lib/resources/stats/stats.service";

describe("MonthlyUserCountByYearController", () => {
    describe("loadData", () => {
        const spyService = vi.spyOn(statsService, "getMonthlyUserCount");
        const DATA = {
            monthlyData: [23, 24],
            lastYearNbUser: 1,
        };
        const CURR_YEAR = new Date().getFullYear();
        const YEAR = CURR_YEAR - 1;
        let ctrl;

        beforeAll(() => {
            spyService.mockResolvedValue(DATA);
            ctrl = new MonthlyUserCountByYearController();
        });
        afterAll(() => spyService.mockRestore());

        it("gets data from service", async () => {
            await ctrl.loadData(YEAR);
            expect(spyService).toBeCalledWith(YEAR);
        });

        it("send proper monthly data", async () => {
            const expected = [1, 23, 24];
            const actual = (await ctrl.loadData(YEAR)).monthlyData;
            expect(actual).toEqual(expected);
        });

        it.each`
            time         | year         | propertyName | expected
            ${"current"} | ${CURR_YEAR} | ${"value"}   | ${`+ ${23}`}
            ${"current"} | ${CURR_YEAR} | ${"message"} | ${`Nouveaux utilisateurs depuis janvier ${CURR_YEAR}`}
            ${"past"}    | ${YEAR}      | ${"value"}   | ${`+ ${23}`}
            ${"past"}    | ${YEAR}      | ${"message"} | ${`Nouveaux utilisateurs en ${YEAR}`}
        `(
            "sets correct $propertyName value of aggregateStats in $time year",
            async ({ year, propertyName, expected }) => {
                const actual = (await ctrl.loadData(year)).aggregateStats[0][propertyName];
                expect(actual).toBe(expected);
            },
        );
    });
});
