import statsPort from "./stats.port";
import statsService from "./stats.service";

describe("statsService", () => {
    describe("getTopAssociations", () => {
        let portGetTopAssociationsMock;

        beforeAll(() => {
            portGetTopAssociationsMock = jest.spyOn(statsPort, "getTopAssociations");
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
        const spyPort = jest.spyOn(statsPort, "getMonthlyUserCount");
        const YEAR = 2022;

        it("calls getMonthlyUserCount", async () => {
            spyPort.mockImplementationOnce(jest.fn());
            await statsService.getMonthlyUserCount(YEAR);
            expect(spyPort).toHaveBeenCalledWith(YEAR);
        });

        it("returns port's result", async () => {
            const expected = {};
            spyPort.mockResolvedValueOnce(expected);
            const actual = await statsService.getMonthlyUserCount(2022);
            expect(expected).toBe(actual);
        });
    });

    describe("getMonthlyRequest", () => {
        const spyPort = jest.spyOn(statsPort, "getMonthlyRequestCount");
        const YEAR = 2022;

        it("calls getMonthlyRequestCount", async () => {
            spyPort.mockImplementationOnce(jest.fn());
            await statsService.getMonthlyRequestCount(YEAR);
            expect(spyPort).toHaveBeenCalledWith(YEAR);
        });

        it("returns port's result", async () => {
            const expected = {};
            spyPort.mockResolvedValueOnce(expected);
            const actual = await statsService.getMonthlyRequestCount(2022);
            expect(expected).toBe(actual);
        });
    });
});
