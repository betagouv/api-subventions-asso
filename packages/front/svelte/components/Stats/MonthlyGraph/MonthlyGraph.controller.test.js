jest.mock("@helpers/dateHelper", () => {
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

import { MonthlyGraphController } from "./MonthlyGraph.controller";
import Chart from "chart.js/auto";

describe("MonthlyGraphController", () => {
    const TITLE = "titre";
    const LOAD_DATA = jest.fn();
    const RESOURCE_NAME = "trucs";
    describe("constructor", () => {
        it.each`
            parameterName          | expected
            ${"_monthData"}        | ${[]}
            ${"yearOptions"}       | ${[{ value: 2023, label: 2023 }, { value: 2022, label: 2022 }]}
            ${"title"}             | ${TITLE}
            ${"resourceName"}      | ${RESOURCE_NAME}
            ${"withPreviousValue"} | ${false}
        `("initializes correctly $parameterName", ({ parameterName, expected }) => {
            const ctrl = new MonthlyGraphController(LOAD_DATA, TITLE, RESOURCE_NAME);
            expect(ctrl[parameterName]).toEqual(expected);
        });

        it.each`
            parameterName    | expected
            ${"year"}        | ${new Date().getFullYear()}
            ${"dataPromise"} | ${Promise.resolve()}
        `("initializes correctly $parameterName store", ({ parameterName, expected }) => {
            const ctrl = new MonthlyGraphController(LOAD_DATA, TITLE);
            expect(ctrl[parameterName].value).toEqual(expected);
        });
    });

    describe("init", () => {
        const ctrl = new MonthlyGraphController(LOAD_DATA, TITLE);
        const loadSpy = jest.spyOn(ctrl, "_load");

        it("loads data", () => {
            loadSpy.mockImplementationOnce(jest.fn());
            ctrl.init();
            expect(loadSpy).toBeCalledWith(ctrl.year.value);
        });
    });

    describe("_load", () => {
        const MONTHLY_DATA = [43, 44];
        const DATA = {
            monthlyData: MONTHLY_DATA,
            lastYearNbUser: 42
        };
        const LOAD_DATA = jest.fn(() => Promise.resolve(DATA));
        const YEAR = 2022;
        let ctrl;

        beforeAll(() => {
            ctrl = new MonthlyGraphController(LOAD_DATA, TITLE);
        });

        it("gets data from given loadData", async () => {
            await ctrl._load(YEAR);
            expect(LOAD_DATA).toBeCalledWith(YEAR);
        });

        it("updates data promise with result from given loadData", async () => {
            const expected = Promise.resolve(DATA);
            await ctrl._load(YEAR);
            const actual = ctrl.dataPromise.value;
            expect(actual).toEqual(expected);
        });

        it("updates private _monthData with result from service", async () => {
            const expected = DATA.monthlyData;
            await ctrl._load(YEAR);
            const actual = ctrl._monthData;
            expect(actual).toStrictEqual(expected);
        });
    });

    describe("onCanvasMount", () => {
        const CANVAS = {};
        const TOOLTIP = {};
        const CHART = {};
        const ctrl = new MonthlyGraphController(LOAD_DATA, TITLE);
        let buildChartSpy = jest.spyOn(ctrl, "_buildChart").mockImplementation(() => (ctrl.chart = CHART));
        ctrl.dataPromise = Promise.resolve();

        it("calls _buildChart", async () => {
            await ctrl.onCanvasMount(CANVAS, TOOLTIP);
            expect(buildChartSpy).toBeCalledWith(CANVAS, TOOLTIP);
        });

        it("updates canvas with result from build", async () => {
            const expected = CHART;
            await ctrl.onCanvasMount(CANVAS, TOOLTIP);
            const actual = ctrl.chart;
            expect(actual).toBe(expected);
        });
    });

    describe("updateYear", () => {
        const ctrl = new MonthlyGraphController(LOAD_DATA, TITLE);

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
            loadSpy.mockImplementationOnce(async () => {
                ctrl._monthData = DATA;
            });
            const expected = DATA;
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
        const ctrl = new MonthlyGraphController(LOAD_DATA, TITLE);
        ctrl.chart = { data: { datasets: [{}] } };

        it("sets proper value", () => {
            const RES = {};
            const expected = RES;
            ctrl.chartData = RES;
            const actual = ctrl.chart.data.datasets[0].data;
            expect(actual).toBe(expected);
        });
    });

    describe("_buildChart", () => {
        const ctrl = new MonthlyGraphController(LOAD_DATA, TITLE);
        const CHART = {};
        const TOOLTIP = { $set: jest.fn() };
        const CANVAS = {
            getContext: () => ({
                createLinearGradient: () => ({ addColorStop: jest.fn() })
            })
        };

        it("returns if canvas is undefined", () => {
            ctrl._buildChart(undefined, TOOLTIP);
            expect(Chart).not.toHaveBeenCalled();
        });

        it("returns if container is undefined", () => {
            ctrl._buildChart(CANVAS, undefined);
            expect(Chart).not.toHaveBeenCalled();
        });

        it("build Chart with appropriate canvas", () => {
            ctrl._buildChart(CANVAS, TOOLTIP);
            expect(Chart).toBeCalledWith(CANVAS, expect.anything());
        });

        it("returns Chart Object", () => {
            const expected = CHART;
            const actual = ctrl._buildChart(CANVAS, TOOLTIP);
            expect(actual).toStrictEqual(expected);
        });

        it("sets data with correct values", () => {
            ctrl._monthData = [22, 40];
            const expected = [22, 40];
            ctrl._buildChart(CANVAS, TOOLTIP);
            const actual = Chart.mock.calls[0][1].data.datasets[0].data;
            expect(actual).toStrictEqual(expected);
        });

        it("sets labels with correct values (default 'withPreviousValue')", () => {
            const expected = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
            ctrl._buildChart(CANVAS, TOOLTIP);
            const actual = Chart.mock.calls[0][1].data.labels;
            expect(actual).toStrictEqual(expected);
        });

        it("sets labels with correct values with previous value", () => {
            const ctrl = new MonthlyGraphController(LOAD_DATA, TITLE, "", true);
            const expected = ["", "J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
            ctrl._buildChart(CANVAS, TOOLTIP);
            const actual = Chart.mock.calls[0][1].data.labels;
            expect(actual).toStrictEqual(expected);
        });
    });
});
