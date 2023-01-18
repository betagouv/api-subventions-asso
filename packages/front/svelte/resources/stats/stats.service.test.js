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
});
