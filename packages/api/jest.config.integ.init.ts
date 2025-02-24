import miscScdlProducersPort from "./src/dataProviders/db/providers/scdl/miscScdlProducers.port";
import stateBudgetProgramPort from "./src/dataProviders/db/state-budget-program/stateBudgetProgram.port";

import { LOCAL_AUTHORITIES } from "./tests/dataProviders/db/__fixtures__/scdl.fixtures";
import PROGRAMS from "./tests/dataProviders/db/__fixtures__/stateBudgetProgram";

export async function initTests() {
    await miscScdlProducersPort.create(LOCAL_AUTHORITIES[0]);
    await stateBudgetProgramPort.replace(PROGRAMS);
}
