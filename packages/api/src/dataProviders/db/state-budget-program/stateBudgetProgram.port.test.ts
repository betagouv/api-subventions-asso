import { STATE_BUDGET_PROGRAM_DBOS } from "./__fixtures__/StateBudgetProgramDbo.fixture";
import { STATE_BUDGET_PROGRAM_ENTITIES } from "./__fixtures__/StateBudgetProgramEntities.fixture";
import stateBudgetProgramPort from "./stateBudgetProgram.port";

const mockDeleteMany = jest.fn();

const mockInsertMany = jest.fn();
const mockFind = jest.fn();
const mockFindOne = jest.fn();

jest.mock("../../../shared/MongoConnection", () => ({
    collection: () => ({
        deleteMany: mockDeleteMany,
        insertMany: mockInsertMany,
        find: mockFind,
        findOne: mockFindOne,
    }),
}));

describe("StateBudgetProgram Port", () => {
    describe("replace()", () => {
        it("should call deleteMany", async () => {
            await stateBudgetProgramPort.replace(STATE_BUDGET_PROGRAM_ENTITIES);
            expect(mockDeleteMany).toHaveBeenCalledWith({});
        });

        it("should call insertMany with the correct arguments", async () => {
            await stateBudgetProgramPort.replace(STATE_BUDGET_PROGRAM_ENTITIES);
            expect(mockInsertMany).toHaveBeenCalledWith(STATE_BUDGET_PROGRAM_DBOS);
        });
    });

    describe("find()", () => {
        it("should return an array of StateBudgetProgramDbo", async () => {
            const expectedPrograms = STATE_BUDGET_PROGRAM_ENTITIES;
            mockFind.mockReturnValueOnce({
                map: jest.fn().mockReturnValueOnce({
                    toArray: jest.fn().mockResolvedValueOnce(expectedPrograms),
                }),
            });

            const programs = await stateBudgetProgramPort.find();

            expect(programs).toEqual(expectedPrograms);
            expect(mockFind).toHaveBeenCalled();
        });
    });

    describe("findByCode()", () => {
        it("should return the matching StateBudgetProgramDbo", async () => {
            const code = "ABC";
            const expectedProgram = STATE_BUDGET_PROGRAM_ENTITIES[0];
            mockFindOne.mockReturnValueOnce(STATE_BUDGET_PROGRAM_DBOS[0]);

            const program = await stateBudgetProgramPort.findByCode(code);

            expect(program).toEqual(expectedProgram);
            expect(mockFindOne).toHaveBeenCalledWith({ code });
        });
    });
});
