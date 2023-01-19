jest.mock("chart.js/auto", () =>
    jest.fn(function () {
        return {};
    })
);

import statsService from "@resources/stats/stats.service";
import Chart from "chart.js/auto";
import UserDistributionController from "./UserDistribution.controller";

describe("UserDistributionController", () => {
    describe("init", () => {
        const getUsersDistributionMock = jest.spyOn(statsService, "getUsersDistribution");
        let controller;

        beforeEach(() => {
            controller = new UserDistributionController();
        });

        it("should call service", async () => {
            getUsersDistributionMock.mockImplementationOnce(() => ({}));

            await controller.init();

            expect(getUsersDistributionMock).toHaveBeenCalledTimes(1);
        });

        it("should set values on store", async () => {
            const [ADMIN, ACTIVE, IDLE, INACTIVE] = [1, 2, 3, 4];
            getUsersDistributionMock.mockImplementationOnce(() => ({
                admin: ADMIN,
                active: ACTIVE,
                idle: IDLE,
                inactive: INACTIVE
            }));

            await controller.init();

            expect(controller.admin.value).toBe(ADMIN);
            expect(controller.active.value).toBe(ACTIVE);
            expect(controller.idle.value).toBe(IDLE);
            expect(controller.inactive.value).toBe(INACTIVE);
        });
    });

    describe("set canvas", () => {
        let controller;
        let updateMock;

        beforeEach(() => {
            controller = new UserDistributionController();
            updateMock = jest.spyOn(controller, "_update");
        });

        it("should don't save canvas if is falsy", () => {
            controller.canvas = false;

            expect(controller._canvas).not.toBe(false);
        });

        it("should save canvas ", () => {
            const expected = { test: true };
            updateMock.mockImplementationOnce(() => null);
            controller.canvas = expected;

            expect(controller._canvas).toEqual(expected);
        });

        it("should call _update ", () => {
            updateMock.mockImplementationOnce(() => null);
            controller.canvas = { test: true };

            expect(updateMock).toBeCalledTimes(1);
        });
    });

    describe("_update", () => {
        let controller;

        beforeEach(() => {
            controller = new UserDistributionController();
        });

        it("should init a new Chart", () => {
            controller._update();
            expect(Chart).toBeCalledTimes(1);
        });

        it("should start chart with canvas", () => {
            const expected = { test: true };
            controller._canvas = expected;
            controller._update();
            expect(Chart).toHaveBeenCalledWith(expected, expect.any(Object));
        });

        it("should start chart with data", () => {
            const [ADMIN, ACTIVE, IDLE, INACTIVE] = [1, 2, 3, 4];
            controller.admin.set(ADMIN);
            controller.active.set(ACTIVE);
            controller.idle.set(IDLE);
            controller.inactive.set(INACTIVE);

            const expected = [
                { test: true },
                {
                    type: "pie",
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                display: false
                            }
                        }
                    },
                    data: {
                        labels: [
                            "Administrateurs",
                            "Utilisateurs actif (hors admin)",
                            "Utilisateurs non actifs (hors admin)",
                            "Utilisateurs n'ayant pas activer leurs comptes (hors admin)"
                        ],
                        datasets: [
                            {
                                label: "Utilisateurs",
                                data: [ADMIN, ACTIVE, IDLE, INACTIVE],
                                backgroundColor: ["#fef3fd", "#dee5fd", "#3558a2", "#fef4f3"]
                            }
                        ]
                    }
                }
            ];

            controller._canvas = expected[0];

            controller._update();

            expect(Chart).toHaveBeenCalledWith(...expected);
        });
    });
});
