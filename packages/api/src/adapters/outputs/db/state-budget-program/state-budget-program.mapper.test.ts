import StateBudgetProgramMapper from "./state-budget-program.mapper";
import { STATE_BUDGET_PROGRAM_ENTITIES } from "./__fixtures__/StateBudgetProgramEntities.fixture";
import { STATE_BUDGET_PROGRAM_DBOS } from "./__fixtures__/StateBudgetProgramDbo.fixture";
import { ObjectId } from "mongodb";

describe("StateBudgetProgramAdapter", () => {
    describe("toDbo", () => {
        it("should convert StateBudgetProgramEntity to StateBudgetProgramDbo", () => {
            const result = StateBudgetProgramMapper.toDbo(STATE_BUDGET_PROGRAM_ENTITIES[0]);
            expect(result).toEqual({ ...STATE_BUDGET_PROGRAM_DBOS[0], _id: expect.any(ObjectId) });
        });
    });

    describe("toEntity", () => {
        it("should convert StateBudgetProgramDbo to StateBudgetProgramEntity", () => {
            const result = StateBudgetProgramMapper.toEntity(STATE_BUDGET_PROGRAM_DBOS[0]);
            expect(result).toEqual(STATE_BUDGET_PROGRAM_ENTITIES[0]);
        });
    });
});
