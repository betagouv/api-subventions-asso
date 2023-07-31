vi.mock("chart.js/auto", () => ({
    default: vi.fn(function () {
        return {};
    })
}));

import Chart from "chart.js/auto";
import UserDistributionController from "./UserDistribution.controller";
import statsService from "$lib/resources/stats/stats.service";

describe("UserDistributionController", () => {
    describe("init", () => {
        const getUsersDistributionMock = vi.spyOn(statsService, "getUsersDistribution");
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
                inactive: INACTIVE,
            }));

            await controller.init();

            expect(controller.distributions.value).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        value: ADMIN,
                    }),
                    expect.objectContaining({
                        value: ACTIVE,
                    }),
                    expect.objectContaining({
                        value: IDLE,
                    }),
                    expect.objectContaining({
                        value: INACTIVE,
                    }),
                ]),
            );
        });
    });

    describe("set canvas", () => {
        let controller;
        let updateMock;

        beforeEach(() => {
            controller = new UserDistributionController();
            updateMock = vi.spyOn(controller, "_update");
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
            const data = { admin: 1, active: 2, idle: 3, inactive: 4 };
            controller.distributions.value.forEach(distribution => {
                distribution.value = data[distribution.name];
            });
            const expected = [
                { test: true },
                expect.objectContaining({
                    data: expect.objectContaining({
                        labels: [
                            "Administrateurs",
                            "Utilisateurs actifs (hors admin)",
                            "Utilisateurs non actifs (hors admin)",
                            "Utilisateurs n'ayant pas activé leurs comptes (hors admin)",
                        ],
                        datasets: [
                            expect.objectContaining({
                                data: Object.values(data),
                                backgroundColor: ["#fef3fd", "#dee5fd", "#3558a2", "#fef4f3"],
                            }),
                        ],
                    }),
                }),
            ];

            controller._canvas = expected[0];

            controller._update();

            expect(Chart).toHaveBeenCalledWith(...expected);
        });
    });
});
