jest.mock("../../../../../helpers/dateHelper", () => {
    return {
        __esModule: true, // this property makes it work
        STATS_YEAR_CHOICES: [2023, 2022]
    };
});
jest.mock("chart.js/auto", () =>
    jest.fn(function () {
        return {};
    })
);

import { monthCapitalizedFromId } from "../../../../../helpers/dateHelper";
import { MonthlyUserCountByYearController } from "./MonthlyUserCountByYear.controller";
import statsService from "../../../../../resources/stats/stats.service";
import Chart from "chart.js/auto";

describe("MonthlyUserCountByYearController", () => {
    describe("constructor", () => {
        it.each`
            parameterName        | expected
            ${"_monthData"}      | ${[]}
            ${"_lastYearNbUser"} | ${0}
            ${"yearOptions"}     | ${[{ value: 2023, label: 2023 }, { value: 2022, label: 2022 }]}
        `("initializes correctly $parameterName", ({ parameterName, expected }) => {
            const ctrl = new MonthlyUserCountByYearController();
            expect(ctrl[parameterName]).toEqual(expected);
        });

        it.each`
            parameterName | expected
            ${"year"}     | ${new Date().getFullYear()}
            ${"progress"} | ${0}
            ${"message"}  | ${""}
        `("initializes correctly $parameterName store", ({ parameterName, expected }) => {
            const ctrl = new MonthlyUserCountByYearController();
            expect(ctrl[parameterName].value).toEqual(expected);
        });
    });

    describe("init", () => {
        const ctrl = new MonthlyUserCountByYearController();
        const loadSpy = jest.spyOn(ctrl, "_load");
        it("loads data", () => {
            loadSpy.mockImplementationOnce(jest.fn());
            ctrl.init();
            expect(loadSpy).toBeCalledWith(ctrl.year.value);
        });
    });

    describe("_load", () => {
        const spyService = jest.spyOn(statsService, "getMonthlyUserCount");
        const DATA = {
            evolution_nombres_utilisateurs: {},
            nombres_utilisateurs_avant_annee: 1
        };
        const YEAR = 2022;
        let ctrl;
        let updateProgressSpy;

        beforeAll(() => {
            spyService.mockResolvedValue(DATA);
            ctrl = new MonthlyUserCountByYearController();
            updateProgressSpy = jest.spyOn(ctrl, "updateProgress").mockImplementation(jest.fn());
        });
        afterAll(() => spyService.mockRestore());

        it("gets data from service", async () => {
            await ctrl._load(YEAR);
            expect(spyService).toBeCalledWith(YEAR);
        });

        it("updates data promise with result from service", async () => {
            const expected = {};
            spyService.mockReturnValueOnce(expected);
            await ctrl._load(YEAR);
            const actual = ctrl.dataPromise.value;
            expect(actual).toBe(expected);
        });

        it("updates private _monthData with result from service", async () => {
            const expected = DATA.evolution_nombres_utilisateurs;
            await ctrl._load(YEAR);
            const actual = ctrl._monthData;
            expect(actual).toStrictEqual(expected);
        });

        it("updates private _lastYearNbUser with result from service", async () => {
            const expected = DATA.nombres_utilisateurs_avant_annee;
            await ctrl._load(YEAR);
            const actual = ctrl._lastYearNbUser;
            expect(actual).toStrictEqual(expected);
        });

        it("updates progress", async () => {
            await ctrl._load(YEAR);
            expect(updateProgressSpy).toBeCalled();
        });
    });

    describe("onCanvasMount", () => {
        const CANVAS = {};
        const CHART = {};
        const ctrl = new MonthlyUserCountByYearController();
        let buildChartSpy = jest.spyOn(ctrl, "_buildChart").mockImplementation(() => (ctrl.chart = CHART));
        ctrl.dataPromise = Promise.resolve();

        it("calls _buildChart", async () => {
            await ctrl.onCanvasMount(CANVAS);
            expect(buildChartSpy).toBeCalledWith(CANVAS);
        });

        it("updates canvas with result from build", async () => {
            const expected = CHART;
            await ctrl.onCanvasMount(CANVAS);
            const actual = ctrl.chart;
            expect(actual).toBe(expected);
        });
    });

    describe("updateYear", () => {
        const ctrl = new MonthlyUserCountByYearController();

        ctrl.chart = {
            update: jest.fn(),
            __esModule: true // this property makes it work
        };
        const updateChartSpy = jest.spyOn(ctrl.chart, "update");
        const setterSpy = jest.spyOn(ctrl, "chartData", "set");
        const loadSpy = jest.spyOn(ctrl, "_load");

        const YEAR_INDEX = 0;
        const YEAR = 2023;
        const DATA = [22, 30];

        beforeAll(() => {
            setterSpy.mockImplementation(jest.fn());
            loadSpy.mockImplementation(jest.fn());
        });

        it("calls _load with proper args", async () => {
            loadSpy.mockImplementationOnce(jest.fn());
            await ctrl.updateYear(YEAR_INDEX);
            expect(loadSpy).toBeCalledWith(YEAR);
        });

        it("updates chart data with _data values", async () => {
            const lastData = 20;
            loadSpy.mockImplementationOnce(async () => {
                ctrl._monthData = DATA;
                ctrl._lastYearNbUser = lastData;
            });
            const expected = [lastData, ...DATA];
            await ctrl.updateYear(YEAR_INDEX);
            expect(setterSpy).toBeCalledWith(expected);
        });

        it("updates chart", async () => {
            loadSpy.mockImplementationOnce(jest.fn());
            await ctrl.updateYear(YEAR_INDEX);
            expect(updateChartSpy).toBeCalled();
        });
    });

    describe("chartData setter", () => {
        const ctrl = new MonthlyUserCountByYearController();
        ctrl.chart = { data: { datasets: [{}] } };

        it("sets proper value", () => {
            const RES = {};
            const expected = RES;
            ctrl.chartData = RES;
            const actual = ctrl.chart.data.datasets[0].data;
            expect(actual).toBe(expected);
        });
    });

    describe("updateProgress", () => {
        const ctrl = new MonthlyUserCountByYearController();
        const MONTHDATA = [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 12];
        const LASTYEARDATA = 2;
        const setSpies = {};

        for (const propertyName of ["message", "progress"]) {
            ctrl[propertyName] = {
                set: jest.fn(),
                __esModule: true // this property makes it work
            };
            setSpies[propertyName] = jest.spyOn(ctrl[propertyName], "set");
        }

        beforeEach(() => {
            ctrl._monthData = MONTHDATA;
            ctrl._lastYearNbUser = LASTYEARDATA;
        });

        it.each`
            propertyName
            ${"progress"}
            ${"message"}
        `("does not update $propertyName if data is not set", ({ propertyName }) => {
            ctrl._monthData = undefined;
            ctrl.updateProgress();
            expect(setSpies[propertyName]).not.toBeCalled();
        });

        describe("current year", () => {
            const NOW = new Date();
            const THIS_YEAR = NOW.getFullYear();
            beforeEach(() => ctrl.year.set(THIS_YEAR));

            it.each`
                propertyName  | expected
                ${"progress"} | ${2}
                ${"message"}  | ${`depuis janvier ${THIS_YEAR}`}
            `("sets correct $propertyName value", ({ propertyName, expected }) => {
                ctrl.updateProgress();
                expect(setSpies[propertyName]).toBeCalledWith(expected);
            });
        });

        describe("past year", () => {
            const PAST_YEAR = new Date().getFullYear() - 1;
            beforeEach(() => ctrl.year.set(PAST_YEAR));

            it.each`
                propertyName  | expected
                ${"progress"} | ${10}
                ${"message"}  | ${`en ${PAST_YEAR}`}
            `("sets correct $propertyName value", ({ propertyName, expected }) => {
                ctrl.updateProgress();
                expect(setSpies[propertyName]).toBeCalledWith(expected);
            });
        });
    });

    describe("_buildChart", () => {
        const ctrl = new MonthlyUserCountByYearController();
        const CHART = {};
        const CANVAS = {
            getContext: () => ({
                createLinearGradient: () => ({ addColorStop: jest.fn() })
            })
        };
        it("returns if canvas is undefined", () => {
            ctrl._buildChart(undefined);
            expect(Chart).not.toHaveBeenCalled();
        });

        it("build Chart with appropriate canvas", () => {
            ctrl._buildChart(CANVAS);
            expect(Chart).toBeCalledWith(CANVAS, expect.anything());
        });

        it("returns Chart Object", () => {
            const expected = CHART;
            const actual = ctrl._buildChart(CANVAS);
            expect(actual).toStrictEqual(expected);
        });

        it("sets data with correct values", () => {
            ctrl._monthData = [22, 40];
            ctrl._lastYearNbUser = 12;
            const expected = [12, 22, 40];
            ctrl._buildChart(CANVAS);
            const actual = Chart.mock.calls[0][1].data.datasets[0].data;
            expect(actual).toStrictEqual(expected);
        });

        it("sets labels with correct values", () => {
            const expected = ["", "J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
            ctrl._buildChart(CANVAS);
            const actual = Chart.mock.calls[0][1].data.labels;
            expect(actual).toStrictEqual(expected);
        });
    });
});
