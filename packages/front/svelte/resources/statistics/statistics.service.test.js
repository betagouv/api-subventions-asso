import statisticsPort from "./statistics.port";
import statisticsService from "./statistics.service";

describe("statisticsService", () => {
    describe("getTopAssociations", () => {
        let portGetTopAssociationsMock;

        beforeAll(() => {
            portGetTopAssociationsMock = jest.spyOn(statisticsPort, "getTopAssociations");
        });

        afterAll(() => {
            portGetTopAssociationsMock.mockRestore();
        });

        it("should call statistics port", async () => {
            portGetTopAssociationsMock.mockImplementationOnce(() => []);

            const expected = 1;
            await statisticsService.getTopAssociations();

            const actual = portGetTopAssociationsMock.mock.calls.length;

            expect(actual).toBe(expected);
        });

        it("should call statistics port with arguments", async () => {
            portGetTopAssociationsMock.mockImplementationOnce(() => []);

            const expected = [15, new Date(2012), new Date()];
            await statisticsService.getTopAssociations(...expected);

            const actual = portGetTopAssociationsMock.mock.calls[0];

            expect(actual).toEqual(expected);
        });
    });
});
