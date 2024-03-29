import statsPort from "./stats.port";
import statsService from "./stats.service";
import statsAdapter from "$lib/resources/stats/stats.adapter";

describe("statsService", () => {
    describe("getTopAssociations", () => {
        let portGetTopAssociationsMock;

        beforeAll(() => {
            portGetTopAssociationsMock = vi.spyOn(statsPort, "getTopAssociations");
        });

        afterAll(() => {
            portGetTopAssociationsMock.mockRestore();
        });

        it("should call stats port", async () => {
            portGetTopAssociationsMock.mockImplementationOnce(() => []);

            const expected = 1;
            await statsService.getTopAssociations();

            const actual = portGetTopAssociationsMock.mock.calls.length;

            expect(actual).toBe(expected);
        });

        it("should call stats port with arguments", async () => {
            portGetTopAssociationsMock.mockImplementationOnce(() => []);

            const expected = [15];
            await statsService.getTopAssociations(...expected);

            const actual = portGetTopAssociationsMock.mock.calls[0];

            expect(actual).toEqual(expected);
        });
    });

    describe("getMonthlyUser", () => {
        const spyPort = vi.spyOn(statsPort, "getMonthlyUserCount");
        const spyAdapter = vi.spyOn(statsAdapter, "formatUserCount");
        const PORT_RES = "old value";
        const ADAPTER_RES = "new value";
        const YEAR = 2022;

        beforeAll(() => {
            spyAdapter.mockReturnValue(ADAPTER_RES);
            spyPort.mockResolvedValue(PORT_RES);
        });
        afterAll(() => {
            spyAdapter.mockRestore();
            spyPort.mockRestore();
        });

        it("calls getMonthlyUserCount", async () => {
            await statsService.getMonthlyUserCount(YEAR);
            expect(spyPort).toHaveBeenCalledWith(YEAR);
        });

        it("calls adapter with port's result", async () => {
            await statsService.getMonthlyUserCount(YEAR);
            expect(spyAdapter).toHaveBeenCalledWith(PORT_RES);
        });

        it("returns port's result", async () => {
            const expected = ADAPTER_RES;
            const actual = await statsService.getMonthlyUserCount(YEAR);
            expect(expected).toEqual(actual);
        });
    });

    describe("getMonthlyRequest", () => {
        const spyPort = vi.spyOn(statsPort, "getMonthlyRequestCount");
        const spyAdapter = vi.spyOn(statsAdapter, "formatRequestCount");
        const PORT_RES = "old value";
        const ADAPTER_RES = "new value";
        const YEAR = 2022;

        beforeAll(() => {
            spyAdapter.mockReturnValue(ADAPTER_RES);
            spyPort.mockResolvedValue(PORT_RES);
        });
        afterAll(() => {
            spyAdapter.mockRestore();
            spyPort.mockRestore();
        });

        it("calls getMonthlyUserCount", async () => {
            await statsService.getMonthlyRequestCount(YEAR);
            expect(spyPort).toHaveBeenCalledWith(YEAR);
        });

        it("calls adapter with port's result", async () => {
            await statsService.getMonthlyRequestCount(YEAR);
            expect(spyAdapter).toHaveBeenCalledWith(PORT_RES);
        });

        it("returns port's result", async () => {
            const expected = ADAPTER_RES;
            const actual = await statsService.getMonthlyRequestCount(YEAR);
            expect(expected).toEqual(actual);
        });
    });
});
