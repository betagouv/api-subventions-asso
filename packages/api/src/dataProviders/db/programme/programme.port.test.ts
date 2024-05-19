import { PROGRAMME_DBOS } from "./__fixtures__/ProgrammeDbo.fixture";
import programmePort from "./programme.port";

const mockDeleteMany = jest.fn();

const mockInsertMany = jest.fn();

jest.mock("../../../shared/MongoConnection", () => ({
    collection: () => ({
        deleteMany: mockDeleteMany,
        insertMany: mockInsertMany,
    }),
}));

describe("Programme Port", () => {
    describe("replace()", () => {
        it("should call deleteMany", async () => {
            // @ts-expect-error: fixtures
            await programmePort.replace(PROGRAMME_DBOS);
            expect(mockDeleteMany).toHaveBeenCalledWith({});
        });

        it("should call replace", async () => {
            // @ts-expect-error: fixtures
            await programmePort.replace(PROGRAMME_DBOS);
            expect(mockInsertMany).toHaveBeenCalledWith(PROGRAMME_DBOS);
        });
    });
});
