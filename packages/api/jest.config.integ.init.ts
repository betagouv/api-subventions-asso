import miscScdlProducersAdapter from "./src/adapters/outputs/db/providers/scdl/misc-scdl-producers.adapter";
import stateBudgetProgramAdapter from "./src/adapters/outputs/db/state-budget-program/state-budget-program.adapter";
import { LOCAL_AUTHORITIES } from "./tests/adapters/outputs/db/__fixtures__/scdl.fixtures";
import { PROGRAMS } from "./tests/adapters/outputs/db/__fixtures__/state-budget-program.fixtures";

export async function initTests() {
    await miscScdlProducersAdapter.create(LOCAL_AUTHORITIES[0]);
    await stateBudgetProgramAdapter.replace(PROGRAMS);
}
