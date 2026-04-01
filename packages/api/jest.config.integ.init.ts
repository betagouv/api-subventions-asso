import miscScdlProducersAdapter from "./src/dataProviders/db/providers/scdl/miscScdlProducers.adapter";
import stateBudgetProgramAdapter from "./src/dataProviders/db/state-budget-program/state-budget-program.adapter";

import { LOCAL_AUTHORITIES } from "./tests/dataProviders/db/__fixtures__/scdl.fixtures";
import PROGRAMS from "./tests/dataProviders/db/__fixtures__/stateBudgetProgram";

export async function initTests() {
    await miscScdlProducersAdapter.create(LOCAL_AUTHORITIES[0]);
    await stateBudgetProgramAdapter.replace(PROGRAMS);
}
