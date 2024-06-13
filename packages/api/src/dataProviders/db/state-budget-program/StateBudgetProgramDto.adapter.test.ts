import StateBudgetProgramDtoAdapter from "./StateBudgetProgramDto.adapter";
import { STATE_BUDGET_PROGRAM_ENTITIES } from "./__fixtures__/StateBudgetProgramEntities.fixture";
import { STATE_BUDGET_PROGRAM_DBOS } from "./__fixtures__/StateBudgetProgramDbo.fixture";

describe("StateBudgetProgramDtoAdapter", () => {
    describe("toDbo", () => {
        it("should convert StateBudgetProgramEntity to StateBudgetProgramDbo", () => {
            const result = StateBudgetProgramDtoAdapter.toDbo(STATE_BUDGET_PROGRAM_ENTITIES[0]);
            expect(result).toEqual(STATE_BUDGET_PROGRAM_DBOS[0]);
        });
    });

    describe("toEntity", () => {
        it("should convert StateBudgetProgramDbo to StateBudgetProgramEntity", () => {
            const result = StateBudgetProgramDtoAdapter.toEntity(STATE_BUDGET_PROGRAM_DBOS[0]);
            expect(result).toEqual(STATE_BUDGET_PROGRAM_ENTITIES[0]);
        });
    });
});
