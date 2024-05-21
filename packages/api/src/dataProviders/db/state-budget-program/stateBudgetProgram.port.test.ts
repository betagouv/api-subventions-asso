import { STATE_BUDGET_PROGRAM_DBOS } from "./__fixtures__/StateBudgetProgramDbo.fixture";
import stateBudgetProgramPort from "./stateBudgetProgram.port";

const mockDeleteMany = jest.fn();

const mockInsertMany = jest.fn();

jest.mock("../../../shared/MongoConnection", () => ({
    collection: () => ({
        deleteMany: mockDeleteMany,
        insertMany: mockInsertMany,
    }),
}));

describe("StateBudgetProgram Port", () => {
    describe("replace()", () => {
        it("should call deleteMany", async () => {
            await stateBudgetProgramPort.replace(STATE_BUDGET_PROGRAM_DBOS);
            expect(mockDeleteMany).toHaveBeenCalledWith({});
        });

        it("should call replace", async () => {
            await stateBudgetProgramPort.replace(STATE_BUDGET_PROGRAM_DBOS);
            expect(mockInsertMany).toHaveBeenCalledWith(STATE_BUDGET_PROGRAM_DBOS);
        });
    });
});
