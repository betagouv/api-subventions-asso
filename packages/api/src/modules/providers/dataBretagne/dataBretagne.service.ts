import dataBretagnePort from "../../../dataProviders/api/dataBretagne/dataBretagne.port";
import StateBudgetProgramAdapter from "../../../dataProviders/db/state-budget-program/stateBudgetProgram.adapter";
import stateBudgetProgramPort from "../../../dataProviders/db/state-budget-program/stateBudgetProgram.port";

class DataBretagneService {
    async login() {
        return dataBretagnePort.login();
    }

    async resyncPrograms() {
        await dataBretagnePort.login();
        const programs = await dataBretagnePort.getStateBudgetPrograms();
        // do not replace programs if empty
        if (!programs || !programs.length) throw new Error("Unhandled error from API Data Bretagne");
        return stateBudgetProgramPort.replace(programs.map(program => StateBudgetProgramAdapter.toDbo(program)));
    }
}

const dataBretagneService = new DataBretagneService();
export default dataBretagneService;
